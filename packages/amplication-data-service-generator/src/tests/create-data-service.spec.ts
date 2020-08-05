import { createDataService, Entity } from "..";
import entities from "./entities.json";

describe("createDataService", () => {
  test("creates app as expected", async () => {
    const modules = await createDataService(entities as Entity[]);
    const pathToCode = Object.fromEntries(
      modules.map((module) => [module.path, module.code])
    );
    expect(pathToCode).toMatchSnapshot();
  });
});
