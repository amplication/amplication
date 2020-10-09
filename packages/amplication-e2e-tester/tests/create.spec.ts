// A dummy export declaration for TypeScript to recognize the code as module
export {};

const TITLE = "Amplication";
const LOGIN_URL = "http://localhost:3001/login";
const HOME_PAGE_URL = "http://localhost:3001/";
const USER_EMAIL = "lisa@simpson.com";
const USER_PASSWORD = "secret42";
const CONTINUE_BUTTON_CONTENT = "Continue";
const CREATE_BUTTON_CONTENT = "Create App";
// 1 minute
const TIMEOUT = 60000;

describe("create new app test", () => {
  beforeAll(async () => {
    await page.goto(LOGIN_URL);
  }, TIMEOUT);
  it(
    "should create new app  ",
    async () => {
      page.setDefaultTimeout(TIMEOUT);
      await expect(page.title()).resolves.toMatch(TITLE);
      await (await page.waitForXPath("//input[@name='email']")).type(
        USER_EMAIL
      );
      await (await page.waitForXPath('//input[@name="password"]')).type(
        USER_PASSWORD
      );
      await (
        await page.waitForXPath(
          `//button[contains(text(),'${CONTINUE_BUTTON_CONTENT}')]`
        )
      ).click();
      await page.waitForNavigation();
      await expect(page.url()).toMatch(HOME_PAGE_URL);
      await page.click("a.applications__new-app");
      const appName = createRandomName();
      await (await page.waitForXPath("//input[@name='name']")).type(appName);
      await (
        await page.waitForXPath(
          `//button[@type='submit' and contains(text(),'${CREATE_BUTTON_CONTENT}')]`
        )
      ).click();
      await page.waitForNavigation();
      const appNameInputValue = await page.waitForXPath(
        '//div[@class="application-home__info__name"]//input[@name="name"]/@value'
      );
      await expect(appNameInputValue).toMatch(appName);
    },
    TIMEOUT
  );
});

function createRandomName(): string {
  return Math.random().toString(32);
}
