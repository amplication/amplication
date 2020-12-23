import {
  LOGIN_URL,
  A_SIGN_UP,
  LOGIN_CONTINUE_BUTTON_CONTENT,
} from "./constants";
import { createRandomName, signUp } from "./functions";

const CREATE_BUTTON_CONTENT = "Create App";
const TIMEOUT = 600000;
const Colours = ["Yellow", "Red", "Pink", "Turquoise", "Green", "Blue"];

describe("Change app color test", () => {
  beforeAll(async () => {
    await page.goto(LOGIN_URL);
  }, TIMEOUT);
  it(
    "should change app color ",
    async () => {
      page.setDefaultTimeout(TIMEOUT);
      await signUp(A_SIGN_UP, LOGIN_CONTINUE_BUTTON_CONTENT);
      await page.click("a.applications__new-app");
      const appName = createRandomName();
      await (await page.waitForXPath("//input[@name='name']")).type(appName);
      await (
        await page.waitForXPath(
          `//button[@type='submit' and contains(text(),'${CREATE_BUTTON_CONTENT}')]`
        )
      ).click();
      await page.waitForNavigation();
      for (const element of Colours) {
        const oldBadgeStyle = await page.waitForXPath(
          `//div[@class='circle-badge']/@style`
        );
        await (
          await page.waitForSelector(
            ".select-field__container > .select-field__control > .select-field__indicators > .select-field__indicator"
          )
        ).click();
        await (
          await page.waitForXPath(`//div[contains(text(),'${element}')]`)
        ).click();
        await page.waitFor(1500);
        const newBadgeStyle = await page.waitForXPath(
          `//div[@class='circle-badge']/@style`
        );
        expect(newBadgeStyle).not.toEqual(oldBadgeStyle);
      }
    },
    TIMEOUT
  );
});
