import path from 'path';
import { Application } from 'spectron';

const fromRoot = file => path.join(process.cwd(), file);

const app = new Application({
  path: fromRoot('node_modules/.bin/electron'),
  args: [fromRoot('app')],
});

const getRemoteApp = () => app.electron.remote.app;

const captureScreenshot = async selector => {
  // Get position of target element
  const execResult = await app.client.executeAsync((selector, done) => {
    done(document.querySelector(selector).getBoundingClientRect());
  }, selector);
  const rect = execResult.value;
  // Capture a screenshot
  const image = await app.browserWindow.capturePage({
    x: parseInt(rect.left),
    y: parseInt(rect.top),
    width: parseInt(rect.width),
    height: parseInt(rect.height),
  });
  return image;
};

const selectByTestId = id => `[data-test-id="${id}"]`;

export default app;
export { getRemoteApp, captureScreenshot, selectByTestId };
