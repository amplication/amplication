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
// 10 minutes
const TIMEOUT = 600000;
describe("create new entity test", () => {
  beforeAll(async () => {
    await page.goto(LOGIN_URL);
  }, TIMEOUT);
  it(
    "should create new entity",
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
        await page.waitForXPath(`//i[contains(text(),'${I_ENTITY}')]`)
      ).click();
      await page.waitForNavigation();
      const entityNameSpan = await page.waitForXPath(
        `//span[@class="text-medium" and contains(.,"${entityName}")]`
      );
      expect(entityNameSpan).toBeTruthy();
    },
    TIMEOUT
  );
});
