import {
  LOGIN_URL,
  A_SIGN_UP,
  LOGIN_CONTINUE_BUTTON_CONTENT,
} from "./constants";
import { createRandomName, signUp } from "./functions";

const CREATE_BUTTON_CONTENT = "Create App";
const NEW_APP_TITLE = "New App";
const TIMEOUT = 600000;

describe("change app title test", () => {
  beforeAll(async () => {
    await page.goto(LOGIN_URL);
  }, TIMEOUT);
  it(
    "should change app title ",
    async () => {
      page.setDefaultTimeout(TIMEOUT);
      await signUp(A_SIGN_UP, LOGIN_CONTINUE_BUTTON_CONTENT);
      await page.click("a.applications__new-app");
      const tmpAppName = createRandomName();
      await (await page.waitForXPath("//input[@name='name']")).type(tmpAppName);
      await (
        await page.waitForXPath(
          `//button[@type='submit' and contains(text(),'${CREATE_BUTTON_CONTENT}')]`
        )
      ).click();
      await page.waitForNavigation();
      const appNameInput = await page.waitForXPath(
        '//div[@class="text-input__inner-wrapper"]//input[@name="name"]'
      );
      await appNameInput.click({ clickCount: 3 });
      await appNameInput.press("Backspace");
      await appNameInput.type(NEW_APP_TITLE);
      await (
        await page.waitForXPath(`//a[@class="logo-container__logo"]`)
      ).click();
      await page.waitForNavigation();
      await page.waitFor(5000);
      const appNameDiv = await page.waitForXPath(
        `//div[@class="application-badge__app-name" and contains(text(),'${NEW_APP_TITLE}')]`,
        { timeout: 5000 }
      );
      expect(appNameDiv).toBeTruthy();
    },
    TIMEOUT
  );
});
