import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { promisify } from 'util';
import execa from 'execa';
import { app, ipcMain, nativeImage, Notification } from 'electron';
import electronUtil from 'electron-util';
import electronDebug from 'electron-debug';
import createMenubar from 'menubar';
import invariant from 'invariant';
import stringToColor from 'string-to-color';
import treeKill from 'tree-kill';
import fixPath from 'fix-path';
import createNotification from '~/common/notification';
import preferences from '~/common/preferences-store';
import Channels from '~/common/channels';
import menubarIcon from '~/assets/menubarTemplate.png';
import '~/assets/menubarTemplate@2x.png';

const noop = () => {};
const isDev = process.env.NODE_ENV === 'development';
electronDebug({ showDevTools: isDev });
fixPath();

const readFileAsync = promisify(fs.readFile);
const statAsync = promisify(fs.stat);
const treeKillAsync = promisify(treeKill);
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
  menubar.window.show();
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
  menubar.tray.on('click', showTray);
  menubar.tray.on('drag-enter', showTray);
  app.on('activate', showTray);
});

app.on('ready', () => {
  electronUtil.enforceMacOSAppLocation();
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
  const { title = 'npmkit', body, ...options } = payload;
  createNotification(title, body, options);
});

// Open terminal in provided directory
ipcMain.on(Channels.TERMINAL_OPEN, (event, { cwd }) => {
  // todo: add support for other paltforms
  if (process.platform === 'darwin') {
    execa('open', ['-a', preferences.get('terminal'), cwd], {
      detached: true,
    });
  }
});

// Run requested script in background
ipcMain.on(Channels.SCRIPT_RUN, (event, { project, script }) => {
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
          `${script} is successfully complete` // Click to show stdout.
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
ipcMain.on(Channels.SCRIPT_STOP, async (event, { pid }) => {
  await treeKillAsync(pid);
});
