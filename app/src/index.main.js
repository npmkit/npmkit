import '~/setup.main';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import util from 'util';
import execa from 'execa';
import { app, ipcMain, dialog } from 'electron';
import checkForUpdates from 'update-electron-app';
import electronUtil from 'electron-util';
import electronDebug from 'electron-debug';
import unhandled from 'electron-unhandled';
import createMenubar from 'menubar';
import invariant from 'invariant';
import stringToColor from 'string-to-color';
import treeKill from 'tree-kill';
import fixPath from 'fix-path';
import createNotification from '~/common/notification';
import Channels from '~/common/channels';
import plugins from '~/plugins';
import preferences from '~/preferences';
import menubarIcon from '~/assets/menubarTemplate.png';
import '~/assets/menubarTemplate@2x.png';

const APP_NAME = 'npmkit';
const UPDATE_INTERVAL = '1 hour';

if (electronUtil.is.development) {
  electronDebug({ showDevTools: false });
} else {
  fixPath();
  unhandled();
  checkForUpdates({ updateInterval: UPDATE_INTERVAL });
}

const isDev = process.env.NODE_ENV === 'development';
const readFileAsync = util.promisify(fs.readFile);
const statAsync = util.promisify(fs.stat);
const treeKillAsync = util.promisify(treeKill);
const menubar = createMenubar({
  index: isDev ? 'http://localhost:8080' : `file://${__dirname}/index.html`,
  width: 320,
  height: 400,
  preloadWindow: true,
  transparent: true,
  resizable: false,
  movable: false,
  minWidth: 320,
  alwaysOnTop: isDev,
  icon: path.join(__dirname, menubarIcon),
});

function showTray() {
  menubar.positioner.move('trayCenter', menubar.tray.getBounds());
  menubar.showWindow();
}

async function getProjectData(projectPath) {
  // Get basic data and validate it
  const projectStat = await statAsync(projectPath);
  invariant(projectStat.isDirectory(), `${projectPath} is not a directory`);
  const packagePath = path.join(projectPath, 'package.json');
  const packageContent = await readFileAsync(packagePath, 'utf8');
  const packageData = JSON.parse(packageContent);
  const packageName = packageData.name || path.basename(projectPath);
  const packageScripts = packageData.scripts || {};
  // Check if it's yarn project
  const yarnLockFilePath = path.join(projectPath, 'yarn.lock');
  const hasYarnLockFile =
    fs.existsSync(yarnLockFilePath) &&
    (await statAsync(yarnLockFilePath)).isFile();
  const npmClient = hasYarnLockFile ? 'yarn' : 'npm';
  // Generate unique code based on project path
  const code = crypto
    .createHash('md5')
    .update(packagePath)
    .digest('hex');
  // Generate color for better visual distinction
  const color = stringToColor(code);
  // Check if project is pinned
  const pinned = preferences.get('pinned').includes(projectPath);
  return {
    code,
    color,
    pinned,
    name: packageName,
    scripts: packageScripts,
    path: projectPath,
    client: npmClient,
  };
}

menubar.on('after-create-window', () => {
  menubar.tray.on('drag-enter', showTray);
});

app.on('ready', async () => {
  menubar.window.on('ready-to-show', showTray);
  await electronUtil.enforceMacOSAppLocation();
});

// Open all projects (e.g. on first run)
ipcMain.on(Channels.PROJECTS_LOAD, event => {
  try {
    preferences.get('projects').forEach(async projectPath => {
      const data = await getProjectData(projectPath);
      event.sender.send(Channels.PROJECT_OPEN_SUCCESS, data);
    });
    event.sender.send(Channels.PROJECTS_LOADED);
  } catch (reason) {
    event.sender.send(Channels.PROJECT_OPEN_ERROR, reason);
  }
});

// Validate new project on reqest
ipcMain.on(Channels.PROJECT_OPEN_REQUEST, async (event, projectPath) => {
  try {
    const data = await getProjectData(projectPath);
    event.sender.send(Channels.PROJECT_OPEN_SUCCESS, data);
  } catch (reason) {
    event.sender.send(Channels.PROJECT_OPEN_ERROR, reason);
  }
});

// Show notification on request
ipcMain.on(Channels.NOTIFICATION_SHOW, (_, payload) => {
  const { title = APP_NAME, body, ...options } = payload;
  createNotification(title, body, options);
});

// Open terminal in provided directory
ipcMain.on(Channels.TERMINAL_OPEN, (event, cwd) => {
  const template = preferences.get('terminal');
  const command = util.format(template, cwd);
  execa.shell(command, { detached: true });
});

// Open provided path in editor
ipcMain.on(Channels.EDITOR_OPEN, (event, path) => {
  const template = preferences.get('editor');
  if (template) {
    execa.shell(util.format(template, path), { detached: true });
    return;
  }
  // There's no easy way to get default editor ☹️
  dialog.showMessageBox(
    {
      type: 'question',
      buttons: ['Cancel', 'Edit in Preferences'],
      defaultId: 1,
      title: APP_NAME,
      message: 'No default editor command set',
      detail:
        'Check "editor" property in your preferences. Use "%s" as a placeholder for project path, e.g. "vscode %s" and try again.',
    },
    response => response && preferences.openInEditor()
  );
});

// Run requested script in background
ipcMain.on(Channels.SCRIPT_RUN, (event, { project, script }) => {
  const noop = () => {};
  // Spawn new process and keep a ref to it
  const child = execa(project.client, ['run', script], {
    cwd: project.path,
    detached: true,
    shell: true,
    reject: false,
  });
  // Wait once exited
  child.then(result => {
    event.sender.send(Channels.SCRIPT_EXITED, { project, script, result });
    // Show notification
    // todo: add script output window
    switch (true) {
      case result.killed || result.signal === 'SIGTERM':
        createNotification(
          project.name,
          `${script} was stopped` // Click to show stderr/stdout.
        ).on('click', noop);
        break;
      case result.failed:
        createNotification(
          project.name,
          `${script} has failed` // Click to show stderr.
        ).on('click', noop);
        break;
      default:
        createNotification(
          project.name,
          `${script} is completed successfully` // Click to show stdout.
        ).on('click', noop);
        break;
    }
  });
  // Reply with process pid
  event.sender.send(Channels.SCRIPT_STARTED, {
    pid: child.pid,
    project,
    script,
  });
});

// Stops running process
ipcMain.on(Channels.SCRIPT_STOP, async (_, { pid }) => {
  await treeKillAsync(pid);
});

// Load plugins
ipcMain.on(Channels.PLUGINS_LOAD, async () => {
  const failed = [];
  const result = await Promise.all(
    preferences.get('plugins').map(async plugin => {
      try {
        const pluginMod = await plugins.load(plugin);
        if (pluginMod.onLoad) {
          pluginMod.onLoad();
        }
      } catch (reason) {
        failed.push([plugin, reason]);
      }
    })
  );
  if (result.length) {
    console.log(`Loaded ${result.length} plugins`);
    createNotification('Plugins', `Loaded ${result.length} plugins`);
  }
  for (const [plugin, reason] of failed) {
    console.error('Failed to load plugin:', reason);
    createNotification(
      APP_NAME,
      `Failed to load plugin ${plugin}, click for details`
    ).on('click', () => {
      const errors = reason.toString().match(/^error (.+)$/gm);
      dialog.showErrorBox(
        APP_NAME,
        `Failed to load ${plugin}:\n\n${errors.join('\n')}`
      );
    });
  }
});
