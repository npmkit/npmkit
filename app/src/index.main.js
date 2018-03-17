import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { promisify } from 'util';
import execa from 'execa';
import { app, ipcMain } from 'electron';
import electronUtil from 'electron-util';
import electronDebug from 'electron-debug';
import createMenubar from 'menubar';
import invariant from 'invariant';
import stringToColor from 'string-to-color';
import store from '~/common/store';
import Channels from '~/common/channels';

electronDebug();

const isDev = process.env.NODE_ENV === 'development';
const readFileAsync = promisify(fs.readFile);
const statAsync = promisify(fs.stat);
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
});

// Show and move tray popup back to its location
const showTray = () => {
  menubar.positioner.move('trayCenter', menubar.tray.getBounds());
  menubar.window.show();
};

menubar.on('after-create-window', () => {
  // Show popup on regular click
  menubar.tray.on('click', showTray);
  // Show popup once file drag overed the tray
  menubar.tray.on('drag-enter', showTray);
  // Show popup once app is activated
  app.on('activate', showTray);
});

app.on('ready', () => {
  electronUtil.enforceMacOSAppLocation();
});

// Validate new project on reqest
ipcMain.on(Channels.PROJECT_OPEN_REQUEST, async (event, projectPath) => {
  try {
    const project = await getProjectDetails(projectPath);
    event.sender.send(Channels.PROJECT_OPEN_SUCCESS, project);
  } catch (reason) {
    event.sender.send(Channels.PROJECT_OPEN_ERROR, reason);
  }
});

// Open terminal in provided directory
ipcMain.on(Channels.TERMINAL_OPEN, (event, cwd) => {
  // todo: add support for other paltforms
  if (process.platform === 'darwin') {
    execa('open', ['-a', store.get('terminal'), cwd], {
      detached: true,
    });
  }
});

async function getProjectDetails(projectPath) {
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
  return {
    code,
    color,
    name: packageName,
    scripts: packageScripts,
    path: projectPath,
    client: npmClient,
  };
}
