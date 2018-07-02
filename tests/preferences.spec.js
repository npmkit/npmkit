import { join } from 'path';
import { getRemoteApp } from './__fixtures__/app';

describe('Integration', () => {
  describe('preferences', () => {
    it('sets default preferences', async () => {
      const preferences = require(join(
        await getRemoteApp().getPath('userData'),
        'config.json'
      ));
      expect(preferences).toMatchSnapshot();
    });
  });
});
