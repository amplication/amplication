import { HOME_PAGE_URL } from "./constants";

const TITLE = "Amplication";
// 1 minute
const TIMEOUT = 60000;

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
