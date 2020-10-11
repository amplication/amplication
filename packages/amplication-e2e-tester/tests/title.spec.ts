import { HOME_PAGE_URL } from "./constants";

const TITLE = "Amplication";
// 10 minutes
const TIMEOUT = 600000;

describe("title test", () => {
  it(
    "should set title correctly",
    async () => {
      page.setDefaultTimeout(TIMEOUT);
      await page.goto(HOME_PAGE_URL);
      await expect(page.title()).resolves.toMatch(TITLE);
    },
    TIMEOUT
  );
});
