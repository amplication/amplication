import { createDataService } from "../create-data-service";
import entities from "./entities";
import roles from "./roles";
import appInfo from "./appInfo";

describe("createDataService", () => {
  test("creates app as expected", async () => {
    jest.setTimeout(10000);
    const modules = await createDataService(entities, roles, appInfo);
    const pathToCode = Object.fromEntries(
      modules.map((module) => [module.path, module.code])
    );
    expect(pathToCode).toMatchSnapshot();
  });
});
