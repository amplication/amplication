const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(
    "http://localhost:3000/ckg97x6o00076qkubudirygob/entities/ckg9v8sal6358rgub7bqhffrz"
  );

  await page.setViewport({ width: 1366, height: 625 });

  await page.waitForSelector(
    "form > .text-input > .text-input__inner-wrapper > label > input"
  );
  await page.click(
    "form > .text-input > .text-input__inner-wrapper > label > input"
  );

  await page.type(
    "form > .text-input > .text-input__inner-wrapper > label > input",
    "aaaaa"
  );

  await page.waitForSelector(
    ".amp-data-grid__toolbar > form > .text-input > .text-input__inner-wrapper > .ButtonBase-exshql-0"
  );
  await page.click(
    ".amp-data-grid__toolbar > form > .text-input > .text-input__inner-wrapper > .ButtonBase-exshql-0"
  );

  await page.waitForSelector(
    ".amp-name-field:nth-child(2) > .text-input > .text-input__inner-wrapper > label > input"
  );
  await page.click(
    ".amp-name-field:nth-child(2) > .text-input > .text-input__inner-wrapper > label > input"
  );

  await page.waitForSelector(
    ".amp-name-field:nth-child(2) > .text-input > .text-input__inner-wrapper > label > input"
  );
  await page.click(
    ".amp-name-field:nth-child(2) > .text-input > .text-input__inner-wrapper > label > input"
  );

  await page.type(
    ".amp-name-field:nth-child(2) > .text-input > .text-input__inner-wrapper > label > input",
    "AAA"
  );

  await page.waitForSelector(".toggle-field #toggle--az0tscnges");
  await page.click(".toggle-field #toggle--az0tscnges");

  await page.waitForSelector(".toggle-field #toggle--m4ra6yq2ic");
  await page.click(".toggle-field #toggle--m4ra6yq2ic");

  await page.waitForSelector(
    ".side-bar__wrapper > .side-bar__inner-wrapper > .mdc-drawer__content > .amp-form > .ButtonBase-exshql-0"
  );
  await page.click(
    ".side-bar__wrapper > .side-bar__inner-wrapper > .mdc-drawer__content > .amp-form > .ButtonBase-exshql-0"
  );

  await page.waitForSelector(
    ".amp-form > .text-input > .text-input__inner-wrapper > label > textarea"
  );
  await page.click(
    ".amp-form > .text-input > .text-input__inner-wrapper > label > textarea"
  );

  await page.type(
    ".amp-form > .text-input > .text-input__inner-wrapper > label > textarea",
    "aaaaaaaaaaaaaaaaaaa"
  );

  await page.waitForSelector(
    ".side-bar__inner-wrapper > .side-bar__header > .Tooltip-h3c7f-0 > .ButtonBase-exshql-0 > .rmwc-icon"
  );
  await page.click(
    ".side-bar__inner-wrapper > .side-bar__header > .Tooltip-h3c7f-0 > .ButtonBase-exshql-0 > .rmwc-icon"
  );

  await browser.close();
})();
