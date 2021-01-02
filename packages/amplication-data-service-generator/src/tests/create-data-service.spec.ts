import { createDataService } from "../create-data-service";
import entities from "./entities";
import roles from "./roles";
import appInfo from "./appInfo";

const MODULE_EXTENSIONS_TO_SNAPSHOT = [".ts", ".tsx", ".prisma"];

describe("createDataService", () => {
  test("creates app as expected", async () => {
    jest.setTimeout(100000);
    const modules = await createDataService(entities, roles, appInfo);
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
