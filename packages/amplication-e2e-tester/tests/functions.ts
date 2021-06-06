import { ElementHandle } from "puppeteer";

export function createRandomName(): string {
  const randomString = Math.random().toString(32);
  return "s" + randomString.slice(2, randomString.length);
}
export async function signUp(
  signUpBtn: string,
  continueBtn: string
): Promise<void> {
  await (
    await page.waitForXPath(`//a[contains(text(),'${signUpBtn}')]`)
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
    await page.waitForXPath(`//button[contains(text(),'${continueBtn}')]`)
  ).click();
  await page.waitForNavigation();
  return page.waitFor(500);
}
export async function createNewEntityField(
  fieldType: string,
  addFieldBtn: string,
  addDescriptionBtn: string,
  closeBtn: string
): Promise<ElementHandle> {
  const fieldsName = createRandomName();
  await page.type(
    "form > .text-input > .text-input__inner-wrapper > label > input",
    fieldsName
  );
  await (
    await page.waitForXPath(`//button[contains(text(),'${addFieldBtn}')]`)
  ).click();
  await page.waitFor(500);
  await (
    await page.waitForXPath(`//button[contains(.,'${addDescriptionBtn}')]`)
  ).click();
  await page.waitForSelector(
    ".amp-form > .text-input > .text-input__inner-wrapper > label > textarea"
  );
  await page.type(
    ".amp-form > .text-input > .text-input__inner-wrapper > label > textarea",
    createRandomName()
  );
  await (await page.waitForXPath(`//input[@name="required"]`)).click();
  await (await page.waitForXPath(`//input[@name="searchable"]`)).click();
  await page.click(
    ".mdc-drawer__content > .amp-form > .select-field > label > .select-field__container"
  );
  await (
    await page.waitForXPath(`//div[contains(text(),"${fieldType}")]`)
  ).click();
  await (
    await page.waitForXPath(`//button[contains(.,'${closeBtn}')]`)
  ).click();
  return page.waitForXPath(
    `//span[@class="text-medium" and contains(.,"${fieldsName}")]`
  );
}
