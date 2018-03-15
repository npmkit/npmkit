import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { promisify } from 'util';
import { app, ipcMain } from 'electron';
import electronUtil from 'electron-util';
import electronDebug from 'electron-debug';
import isDev from 'electron-is-dev';
import createMenubar from 'menubar';
import invariant from 'invariant';
import stringToColor from 'string-to-color';
import Channels from '~/common/channels';

electronDebug();

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

// Validate project on reqest
ipcMain.on(Channels.PROJECT_OPEN_REQUEST, async (event, projectPath) => {
  try {
    // Get basic data and validate it
    const projectStat = await statAsync(projectPath);
    invariant(projectStat.isDirectory(), `${projectPath} is not a directory`);
    const packagePath = path.join(projectPath, 'package.json');
    const packageContent = await readFileAsync(packagePath, 'utf8');
    const packageData = JSON.parse(packageContent);
    const packageName = packageData.name || path.basename(projectPath);
    // Check of it's a yarn project
    const yarnLockFilePath = path.join(projectPath, 'yarn.lock');
    const hasYarnLockFile =
      fs.existsSync(yarnLockFilePath) &&
      (await statAsync(yarnLockFilePath)).isFile();
    const npmClient = hasYarnLockFile ? 'yarn' : 'npm';
    // Generate uniqe code based on project path
    const code = crypto
      .createHash('md5')
      .update(packagePath)
      .digest('hex');
    // Generate uniqe color for better visual distinction
    const color = stringToColor(code);
    event.sender.send(Channels.PROJECT_OPEN_SUCCESS, {
      code,
      color,
      name: packageName,
      path: projectPath,
      client: npmClient,
    });
  } catch (reason) {
    event.sender.send(Channels.PROJECT_OPEN_ERROR, reason);
  }
});
