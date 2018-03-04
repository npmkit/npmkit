import { app } from 'electron';
import electronUtil from 'electron-util';
import electronDebug from 'electron-debug';
import createMenubar from 'menubar';

electronDebug();

const menubar = createMenubar({
  index: `file://${__dirname}/index.html`,
  width: 320,
  height: 500,
  preloadWindow: true,
  transparent: true,
  resizable: false,
  movable: false,
  minWidth: 320
});

menubar.on('after-create-window', () => {
  menubar.tray.on('click', () => {
    menubar.window.show();
  });

  app.on('activate', () => {
    menubar.window.show();
  });
});

app.on('ready', () => {
  electronUtil.enforceMacOSAppLocation();
});
