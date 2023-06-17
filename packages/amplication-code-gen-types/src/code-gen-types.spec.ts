import { ModuleMap } from "./code-gen-types";
import { join } from "path";
describe("ModuleMap", () => {
  let moduleMap: ModuleMap;
  let logger;

  beforeEach(() => {
    logger = {
      warn: jest.fn(),
    };
    moduleMap = new ModuleMap(logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("merge should merge another map into this map", async () => {
    const anotherMap = new ModuleMap(logger);
    const module1 = { path: "path1", code: "code1" };
    const module2 = { path: "path2", code: "code2" };
    anotherMap.set(module1);
    anotherMap.set(module2);

    await moduleMap.merge(anotherMap);

    expect(moduleMap.get("path1")).toBe(module1);
    expect(moduleMap.get("path2")).toBe(module2);
  });

  test("mergeMany should merge many maps into this map", async () => {
    const map1 = new ModuleMap(logger);
    const map2 = new ModuleMap(logger);
    const module1 = { path: "path1", code: "code1" };
    const module2 = { path: "path2", code: "code2" };
    map1.set(module1);
    map2.set(module2);

    await moduleMap.mergeMany([map1, map2]);

    expect(moduleMap.get("path1")).toBe(module1);
    expect(moduleMap.get("path2")).toBe(module2);
  });

  test("set should add a module to the map", async () => {
    const module = { path: "path", code: "code" };

    await moduleMap.set(module);

    expect(moduleMap.get("path")).toBe(module);
  });

  test("set should overwrite an existing module and log a warning", async () => {
    const existingModule = { path: "path", code: "code" };
    const newModule = { path: "path", code: "newCode" };
    moduleMap.set(existingModule);

    await moduleMap.set(newModule);

    expect(logger.warn).toHaveBeenCalledWith(
      "Module path already exists. Overwriting..."
    );
    expect(moduleMap.get("path")).toBe(newModule);
  });

  test("get should return a module for the given path", async () => {
    const module = { path: "path", code: "code" };
    moduleMap.set(module);

    const result = moduleMap.get("path");

    expect(result).toBe(module);
  });

  test("get should return undefined if no module exists for the path", async () => {
    const result = moduleMap.get("nonexistent");

    expect(result).toBeUndefined();
  });

  test("replace should replace a module in the map", () => {
    const oldModule = { path: "path1", code: "code1" };
    const newModule = { path: "path2", code: "code2" };
    moduleMap.set(oldModule);

    moduleMap.replace(oldModule, newModule);

    expect(moduleMap.get("path1")).toBeUndefined();
    expect(moduleMap.get("path2")).toBe(newModule);
  });

  test("replaceModulesPath should replace all module paths using a function", async () => {
    const module1 = { path: "path1", code: "code1" };
    const module2 = { path: "path2", code: "code2" };
    moduleMap.set(module1);
    moduleMap.set(module2);
    const newPath = "newPath";

    moduleMap.replaceModulesPath((path) => join(newPath, path));

    expect(moduleMap.modules()).toStrictEqual([
      { path: "newPath/path1", code: "code1" },
      { path: "newPath/path2", code: "code2" },
    ]);
  });

  test("replaceModulesCode should replace all module codes using a function", async () => {
    const module1 = { path: "path1", code: "code1" };
    const module2 = { path: "path2", code: "code2" };
    moduleMap.set(module1);
    moduleMap.set(module2);
    const newCode = "newCode";

    await moduleMap.replaceModulesCode(() => newCode);

    expect(moduleMap.get("path1").code).toBe(newCode);
    expect(moduleMap.get("path2").code).toBe(newCode);
  });

  test("modules should return an array of modules", () => {
    const module1 = { path: "path1", code: "code1" };
    const module2 = { path: "path2", code: "code2" };
    moduleMap.set(module1);
    moduleMap.set(module2);

    const result = moduleMap.modules();

    expect(result).toEqual([module1, module2]);
  });
});
