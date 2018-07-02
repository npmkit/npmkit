import { tmpdir } from 'os';
import { join } from 'path';
import { remove } from 'fs-extra';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import app from './__fixtures__/app';

jest.setTimeout(1000 * 30);
expect.extend({ toMatchImageSnapshot });

async function cleanTempConfig() {
  await remove(join(tmpdir(), 'config.json'));
}

beforeAll(async () => {
  await cleanTempConfig();
  await app.start();
  await app.browserWindow.isVisible();
});

afterEach(async () => {
  await cleanTempConfig();
});

afterAll(async () => {
  if (app.isRunning()) {
    await app.stop();
  }
});
