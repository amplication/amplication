const TITLE = "Amplication";
const LOGIN_URL = "http://localhost:3001/login";
const HOME_PAGE_URL = "http://localhost:3001/";
const USER_EMAIL = "lisa@simpson.com";
const USER_PASSWORD = "secret42";
const CONTINUE_BUTTON_CONTENT = "Continue";
const TIMEOUT = 60000;
describe("login test", () => {
  beforeAll(async () => {
    await page.goto(LOGIN_URL);
  }, TIMEOUT);
  it(
    "should log into user account ",
    async () => {
      let resultUrl;
      page.setDefaultTimeout(TIMEOUT);
      await expect(page.title()).resolves.toMatch(TITLE);
      await (await page.waitForXPath("//input[@name='email']")).type(
        USER_EMAIL
      );
      await (await page.waitForXPath('//input[@name="password"]')).type(
        USER_PASSWORD
      );
      (
        await page.waitForXPath(
          `//button[contains(text(),'${CONTINUE_BUTTON_CONNTENT}')]`
        )
      ).click();
      await page.waitForNavigation();
      resultUrl = await page.url();
      await expect(resultUrl).toMatch(HOME_PAGE_URL);
    },
    TIMEOUT
  );
});
