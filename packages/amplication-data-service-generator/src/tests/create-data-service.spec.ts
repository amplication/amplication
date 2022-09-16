import { createDataService } from "../create-data-service";
import { appInfo, MODULE_EXTENSIONS_TO_SNAPSHOT } from "./appInfo";
import entities from "./entities";
import roles from "./roles";
import { EnumResourceType } from "../models";
import { pluginInstallation } from "./pluginInstallation";

jest.setTimeout(100000);

describe("createDataService", () => {
  test("creates resource as expected", async () => {
    const modules = await createDataService({
      entities,
      roles,
      resourceInfo: appInfo,
      resourceType: EnumResourceType.Service,
      plugins: pluginInstallation,
    });
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
