import { MockedLogger } from "@amplication/util/logging/test-utils";
import { createDataService } from "../../src/create-data-service";
import path, { join } from "path";
import { AMPLICATION_MODULES } from "../../src/generate-code";
import { DSGResourceData } from "@amplication/code-gen-types";
import { readFile } from "fs/promises";

jest.setTimeout(1000000);

export const MODULE_EXTENSIONS_TO_SNAPSHOT = [
  ".ts",
  ".tsx",
  ".prisma",
  ".env",
  ".yml",
  ".json",
  ".gitignore",
];
jest.mock("../../src/build-logger");

describe("createDataService", () => {
  let resourceData: DSGResourceData;
  afterEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(async () => {
    const filePath = path.join(__dirname, "input");
    const file = await readFile(filePath, "utf8");

    resourceData = JSON.parse(atob(file));
  });
  test("creates resource within 15s", async () => {
    const startTime = Date.now();

    const DSG_GENERATION_TIMEOUT = 15000;

    await createDataService(
      resourceData,
      MockedLogger,
      join(__dirname, "../../", AMPLICATION_MODULES)
    );

    expect(Date.now() - startTime).toBeLessThan(DSG_GENERATION_TIMEOUT);
  });
});
