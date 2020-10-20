import { Response } from "puppeteer";

export function createRandomName(): string {
  return Math.random().toString(32);
}
export async function signUp(
  signUpBtn: string,
  continueBtn: string
): Promise<Response> {
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
  await (await page.waitForXPath("//input[@name='organizationName']")).type(
    userLastName
  );
  await (
    await page.waitForXPath(`//button[contains(text(),'${continueBtn}')]`)
  ).click();
  return page.waitForNavigation();
}
