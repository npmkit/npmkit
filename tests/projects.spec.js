import { captureScreenshot, selectByTestId } from './__fixtures__/app';

describe('Integration', () => {
  describe('projects', () => {
    it('shows placeholder without projects', async () => {
      expect(
        await captureScreenshot(selectByTestId('projects'))
      ).toMatchImageSnapshot();
    });
  });
});
