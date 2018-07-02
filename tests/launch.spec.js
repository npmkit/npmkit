import app from './__fixtures__/app';

describe('Integration', () => {
  describe('launch', () => {
    it('has visibile popup window', async () => {
      expect(await app.client.getTitle()).toBe('npmkit');
    });

    it('has correct PATH defined', async () => {
      expect((await app.mainProcess.env()).PATH).toContain('/usr/local/bin');
    });
  });
});
