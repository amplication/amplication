import {
  HOME_PAGE_URL,
  LOGIN_URL,
  A_SIGN_UP,
  LOGIN_CONTINUE_BUTTON_CONTENT,
} from "./constants";
import { createRandomName, signUp } from "./functions";

const CREATE_BUTTON_CONTENT = "Create App";
const I_ENTITY = "entity";
const BUTTON_CREATE_NEW = "Create New";
const BUTTON_CREATE_ENTITY = "Create Entity";
const BUTTON_PENDING = "Pending";
const BUTTON_COMMIT_CHANGES = "Commit Changes";
const BUTTON_COMMIT = "Commit";
const BUTTON_PUBLISH = "Publish";
const BUTTON_BUILD = "Create Build";
const BUTTON_BUILD_NEW = "Build New Version";
const TIMEOUT = 60000;
describe("commit change test", () => {
  beforeAll(async () => {
    await page.goto(LOGIN_URL);
  }, TIMEOUT);
  it(
    "should commit the changes in the app",
    async () => {
      page.setDefaultTimeout(TIMEOUT);
      await signUp(A_SIGN_UP, LOGIN_CONTINUE_BUTTON_CONTENT);
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
      await (
        await page.waitForXPath(`//i[contains(text(),'${I_ENTITY}')]`)
      ).click();
      await page.waitForNavigation();
      await (
        await page.waitForXPath(
          `//button[contains(text(),'${BUTTON_CREATE_NEW}')]`
        )
      ).click();
      const entityName = createRandomName();
      await (await page.waitForXPath('//input[@name="displayName"]')).type(
        entityName
      );
      await (
        await page.waitForXPath(
          `//button[contains(text(),'${BUTTON_CREATE_ENTITY}')]`
        )
      ).click();
      await page.waitForNavigation();
      await (
        await page.waitForXPath(
          `//button[contains(text(),'${BUTTON_PENDING}')]`
        )
      ).click();
      await page.waitForNavigation();
      await (
        await page.waitForXPath(
          `//button[contains(text(),'${BUTTON_COMMIT_CHANGES}')]`
        )
      ).click();
      const message = createRandomName();
      await (await page.waitForXPath('//textarea[@name="message"]')).type(
        message
      );
      await (
        await page.waitForXPath(
          `//button[@type="submit" and contains(text(),'${BUTTON_COMMIT}')]`
        )
      ).click();
      await (
        await page.waitForXPath(
          `//button[contains(text(),'${BUTTON_PUBLISH}')]`
        )
      ).click();
      await page.waitForNavigation();
      await (
        await page.waitForXPath(`//button[contains(text(),'${BUTTON_BUILD}')]`)
      ).click();
      const description = createRandomName();
      await (await page.waitForXPath('//textarea[@name="message"]')).type(
        description
      );
      await (
        await page.waitForXPath(
          `//button[@type="submit" and contains(text(),'${BUTTON_BUILD_NEW}')]`
        )
      ).click();
    },
    TIMEOUT
  );
});
