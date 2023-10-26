import { MockedLogger } from "@amplication/util/logging/test-utils";
import { createDataService } from "../create-data-service";
import { MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import { TEST_DATA } from "./test-data";

jest.setTimeout(100000);

describe("createDataService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("creates resource as expected", async () => {
    const modules = await createDataService(TEST_DATA, MockedLogger);
    const modulesToSnapshot = modules
      .modules()
      .filter((module) =>
        MODULE_EXTENSIONS_TO_SNAPSHOT.some((extension) =>
          module.path.endsWith(extension)
        )
      );
    const pathToCode = Object.fromEntries(
      modulesToSnapshot.map((module) => [module.path, module.code])
    );
    expect(pathToCode).toMatchSnapshot();
  });
});
