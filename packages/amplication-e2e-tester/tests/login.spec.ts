import {
  HOME_PAGE_URL,
  LOGIN_URL,
  USER_EMAIL,
  USER_PASSWORD,
  LOGIN_CONTINUE_BUTTON_CONTENT,
} from "./constants";

// 10 minutes
const TIMEOUT = 600000;

describe("login test", () => {
  beforeAll(async () => {
    await page.goto(LOGIN_URL);
  }, TIMEOUT);
  it(
    "should log into user account ",
    async () => {
      page.setDefaultTimeout(TIMEOUT);
      await (await page.waitForXPath("//input[@name='email']")).type(
        USER_EMAIL
      );
      await (await page.waitForXPath('//input[@name="password"]')).type(
        USER_PASSWORD
      );
      await (
        await page.waitForXPath(
          `//button[contains(text(),'${LOGIN_CONTINUE_BUTTON_CONTENT}')]`
        )
      ).click();
      await page.waitForNavigation();
      await expect(page.url()).toMatch(HOME_PAGE_URL);
    },
    TIMEOUT
  );
});
