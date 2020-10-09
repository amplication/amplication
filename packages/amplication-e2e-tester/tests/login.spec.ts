// A dummy export declaration for TypeScript to recognize the code as module
import {
  HOME_PAGE_URL,
  LOGIN_URL,
  USER_EMAIL,
  USER_PASSWORD,
} from "./constants";

const TITLE = "Amplication";
const CONTINUE_BUTTON_CONTENT = "Continue";
// 1 minute
const TIMEOUT = 60000;

describe("login test", () => {
  beforeAll(async () => {
    await page.goto(LOGIN_URL);
  }, TIMEOUT);
  it(
    "should log into user account ",
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
    },
    TIMEOUT
  );
});
