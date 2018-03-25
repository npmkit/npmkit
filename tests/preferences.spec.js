import path from 'path';
import app, { getRemoteApp } from './__fixtures__/app';

describe('Integration', () => {
  describe('preferences', () => {
    it('sets default preferences', async () => {
      await app.browserWindow.isVisible();
      const preferences = require(path.join(
        await getRemoteApp().getPath('userData'),
        'config.json'
      ));
      expect(preferences).toMatchSnapshot();
    });
  });
});
