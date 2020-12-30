import { createDataService } from "../create-data-service";
import entities from "./entities";
import roles from "./roles";
import appInfo from "./appInfo";

describe("createDataService", () => {
  test("creates app as expected", async () => {
    jest.setTimeout(100000);
    const modules = await createDataService(entities, roles, appInfo);
    const typescriptModules = modules.filter(
      (module) => module.path.endsWith(".ts") || module.path.endsWith(".tsx")
    );
    const pathToCode = Object.fromEntries(
      typescriptModules.map((module) => [module.path, module.code])
    );
    expect(pathToCode).toMatchSnapshot();
  });
});
