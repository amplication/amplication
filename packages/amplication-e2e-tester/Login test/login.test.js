describe('login test', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3001/login');
  },60000); 
  it('should log into user account ', async () => {
    page.setDefaultTimeout(60000)
   await expect(page.title()).resolves.toMatch("Amplication");
    const nameInput= await page.waitForXPath("//input[@name='email']");
   await nameInput.type('lisa@simpson.com');
    const passwordInput = await page.waitForXPath('//input[@name="password"]');
    await passwordInput.type('secret42');
    const countinueBtn = await page.click('button.amp-button--primary');
    await page.waitForNavigation();
    const url =await page.url();
    await expect(url).toMatch("http://localhost:3001/");
  },60000);
});