const TITLE = "Amplication";
const LOGIN_URL = "http://localhost:3000/login";
const HOME_PAGE_URL = "http://localhost:3000/";
const USER_EMAIL = "lisa@simpson.com";
const USER_PASSWORD = "secret42";
const APP_NAME = "my first app";
const TIMEOUT = 60000;
const ENTITY_NAME = "my first entity";
const CREATE_ENTITY_BUTTON_CONTENT = "Create Entity"; //starrt
const CREATE_NEW_BUTTON_CONTENT = "Create New";
describe("create new entity test", () => {
  beforeAll(async () => {
    await page.goto(LOGIN_URL);
  }, TIMEOUT);
  it(
    "should create new entity",
    async () => {
      var RESULT_URL;
      var RESULT_SPAN;
      page.setDefaultTimeout(TIMEOUT);
      // await expect(page.title()).resolves.toMatch(TITLE);
      await (await page.waitForXPath("//input[@name='email']")).type(
        USER_EMAIL
      );
      await (await page.waitForXPath('//input[@name="password"]')).type(
        USER_PASSWORD
      );
      await page.click("button.amp-button--primary");
      await page.waitForNavigation();
      RESULT_URL = await page.url();
      await expect(RESULT_URL).toMatch(HOME_PAGE_URL);
      (
        await page.waitForXPath(
          `//div[@class="application-badge__app-name" and contains(.,"${APP_NAME}")]`
        )
      ).click();
      await page.waitForNavigation();
      (await page.waitForXPath('//a[@title="Entities"]')).click();
      await page.waitForNavigation();
      await page.waitForXPath(
        `//button[contains(text(),'${CREATE_NEW_BUTTON_CONTENT}')]`
      );
      await (await page.waitForXPath('//input[@name="displayName"]')).type(
        ENTITY_NAME
      );
      (
        await page.waitForXPath(
          `//button[contains(.,'${CREATE_ENTITY_BUTTON_CONTENT}')]`
        )
      ).click();
      await page.waitForNavigation();
      (await page.waitForXPath('//a[@title="Entities"]')).click();
      await page.waitForNavigation();
      RESULT_SPAN = await page.waitForXPath(
        `//span[@class="text-medium" and contains(.,"${ENTITY_NAME}")]`
      );
      await expect(RESULT_SPAN).toBeTruthy();
    },
    TIMEOUT
  );
});
