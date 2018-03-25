import { promisify } from 'util';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import app, { getRemoteApp } from './__fixtures__/app';
import rimraf from 'rimraf';

jest.setTimeout(1000 * 30);
expect.extend({ toMatchImageSnapshot });

beforeAll(async () => {
  await app.start();
  await app.browserWindow.isVisible();
});

afterAll(async () => {
  await app.stop();
});
