describe('amplication.com', () => {
  beforeAll(async () => {
    await page.goto('https://amplication.com');
  },30000); 

  it('should be titled "amplication - Open-source low-code platform"', async () => {
    await expect(page.title()).resolves.toMatch('amplication - Open-source low-code platform');
  },);
});