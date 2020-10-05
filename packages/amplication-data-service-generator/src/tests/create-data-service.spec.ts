import { createDataService } from "..";
import entities from "./entities";
import roles from "./roles";

describe("createDataService", () => {
  test("creates app as expected", async () => {
    jest.setTimeout(10000);
    const modules = await createDataService(entities, roles);
    const pathToCode = Object.fromEntries(
      modules.map((module) => [module.path, module.code])
    );
    expect(pathToCode).toMatchSnapshot();
  });
});
