import {
  HOME_PAGE_URL,
  LOGIN_URL,
  LOGIN_CONTINUE_BUTTON_CONTENT,
  A_SIGN_UP,
  I_SIGN_OUT,
} from "./constants";
import { createRandomName } from "./functions";

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
      await (
        await page.waitForXPath(`//a[contains(text(),'${A_SIGN_UP}')]`)
      ).click();
      const userEmail = createRandomName() + "@example.com";
      await (await page.waitForXPath("//input[@name='email']")).type(userEmail);
      const userPassword = createRandomName();
      await (await page.waitForXPath("//input[@name='password']")).type(
        userPassword
      );
      await (await page.waitForXPath("//input[@name='confirmPassword']")).type(
        userPassword
      );
      const userFirstName = createRandomName();
      await (await page.waitForXPath("//input[@name='firstName']")).type(
        userFirstName
      );
      const userLastName = createRandomName();
      await (await page.waitForXPath("//input[@name='lastName']")).type(
        userLastName
      );
      await (await page.waitForXPath("//input[@name='workspaceName']")).type(
        userLastName
      );
      await (
        await page.waitForXPath(
          `//button[contains(text(),'${LOGIN_CONTINUE_BUTTON_CONTENT}')]`
        )
      ).click();
      await page.waitForNavigation();
      await (
        await page.waitForXPath(`//i[contains(text(),'${I_SIGN_OUT}')]`)
      ).click();
      await page.waitForNavigation();
      await (await page.waitForXPath("//input[@name='email']")).type(userEmail);
      await (await page.waitForXPath('//input[@name="password"]')).type(
        userPassword
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
