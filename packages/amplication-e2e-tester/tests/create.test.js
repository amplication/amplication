const TITLE = "Amplication";
const LOGIN_URL = "http://localhost:3001/login";
const HOME_PAGE_URL = "http://localhost:3001/";
const USER_EMAIL = "lisa@simpson.com";
const USER_PASSWORD = "secret42";
const APP_NAME = "my second app";
const CONTINUE_BUTTON_CONTENT = "Continue";
const CREATE_BUTTON_CONTENT = "Create App";
const TIMEOUT = 60000;
async function URL_VALIDITY(resultUrl, correctUrl) {
  await expect(resultUrl).toMatch(correctUrl);
}
describe("create new app test", () => {
  beforeAll(async () => {
    await page.goto(LOGIN_URL);
  }, TIMEOUT);
  it(
    "should create new app  ",
    async () => {
      var resultUrl;
      var resultSpan;
      page.setDefaultTimeout(TIMEOUT);
      await expect(page.title()).resolves.toMatch(TITLE);
      await (await page.waitForXPath("//input[@name='email']")).type(
        USER_EMAIL
      );
      await (await page.waitForXPath('//input[@name="password"]')).type(USER_PASSWORD);
      (
        await page.waitForXPath(`//button[contains(text(),'${CONTINUE_BUTTON_CONNTENT}')]`)
      ).click();
      await page.waitForNavigation();
      resultUrl = await page.url();
      URL_VALIDITY(resultUrl,HOME_PAGE_URL);
      await page.click("a.applications__new-app");
      await (await page.waitForXPath("//input[@name='name']")).type(APP_NAME);
      await (
        await page.waitForXPath(
          `//button[@type='submit' and contains(text(),'${CREATE_BUTTON_CONTENT}')]`
        )
      ).click();
      await page.waitForNavigation();
      resultSpan = await page.waitForXPath(
        '//span[@aria-current="page"]/text()'
      );
      await expect(resultSpan).toMatch(APP_NAME);
    },
    TIMEOUT
  );
});
