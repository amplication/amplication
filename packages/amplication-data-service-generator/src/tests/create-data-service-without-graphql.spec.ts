import { createDataService } from "../create-data-service";
import entities from "./entities";
import roles from "./roles";
import { AppInfo } from "@amplication/code-gen-types";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";

const newAppInfo: AppInfo = {
  ...appInfo,
  settings: {
    ...appInfo.settings,
    serverSettings: {
      generateGraphQL: false,
      generateRestApi: true,
      serverPath: "",
    },
  },
};

jest.setTimeout(100000);

describe("createDataService", () => {
  test("creates app as expected", async () => {
    const modules = await createDataService(entities, roles, newAppInfo);
    const modulesToSnapshot = modules.filter((module) =>
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
