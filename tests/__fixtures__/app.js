import path from 'path';
import { Application } from 'spectron';

const fromRoot = file => path.join(process.cwd(), file);

const app = new Application({
  path: fromRoot('node_modules/.bin/electron'),
  args: [fromRoot('app')],
});

const getRemoteApp = () => app.electron.remote.app;

const captureScreenshot = async selector => {
  // Get position of target element and capture a screenshot
  const captureResult = await app.client.executeAsync((selector, done) => {
    const electron = require('electron');
    const clientRect = document.querySelector(selector).getBoundingClientRect();
    const rect = {
      x: parseInt(clientRect.left),
      y: parseInt(clientRect.top),
      width: parseInt(clientRect.width),
      height: parseInt(clientRect.height),
    };
    electron.remote.getCurrentWindow().capturePage(rect, image => {
      done(image.toPNG().toString('base64'));
    });
  }, selector);
  return Buffer.from(captureResult.value, 'base64');
};

const selectByTestId = id => `[data-test-id="${id}"]`;

export default app;
export { getRemoteApp, captureScreenshot, selectByTestId };
