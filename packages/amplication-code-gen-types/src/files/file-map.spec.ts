import { BuildLogger } from "../build-logger";
import { IFile } from "./file.types";
import { FileMap } from "./file-map";
import { join } from "path";

describe("FileMap", () => {
  let fileMap: FileMap<string>;
  let logger: BuildLogger;

  beforeEach(() => {
    logger = {
      warn: jest.fn(),
    } as unknown as BuildLogger;
    fileMap = new FileMap<string>(logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("merge should merge another map into this map", async () => {
    const anotherMap = new FileMap<string>(logger);
    const file1 = <IFile<string>>{ path: "path1", content: "code1" };
    const file2 = <IFile<string>>{ path: "path2", content: "code2" };
    anotherMap.set(file1);
    anotherMap.set(file2);

    await fileMap.merge(anotherMap);

    expect(fileMap.get("path1")).toBe(file1);
    expect(fileMap.get("path2")).toBe(file2);
  });

  test("mergeMany should merge many maps into this map", async () => {
    const map1 = new FileMap<string>(logger);
    const map2 = new FileMap<string>(logger);
    const file1 = { path: "path1", content: "code1" };
    const file2 = { path: "path2", content: "code2" };
    map1.set(file1);
    map2.set(file2);

    await fileMap.mergeMany([map1, map2]);

    expect(fileMap.get("path1")).toBe(file1);
    expect(fileMap.get("path2")).toBe(file2);
  });

  test("set should add a file to the map", async () => {
    const file = { path: "path", content: "code" };

    await fileMap.set(file);

    expect(fileMap.get("path")).toBe(file);
  });

  test("set should overwrite an existing file and log a warning", async () => {
    const existingFile = { path: "path", content: "code" };
    const newFile = { path: "path", content: "newCode" };
    fileMap.set(existingFile);

    await fileMap.set(newFile);

    expect(logger.warn).toHaveBeenCalledWith(
      "File path already exists. Overwriting..."
    );
    expect(fileMap.get("path")).toBe(newFile);
  });

  test("get should return a file for the given path", async () => {
    const file = { path: "path", content: "code" };
    fileMap.set(file);

    const result = fileMap.get("path");

    expect(result).toBe(file);
  });

  test("get should return undefined if no file exists for the path", async () => {
    const result = fileMap.get("nonexistent");

    expect(result).toBeUndefined();
  });

  test("replace should replace a file in the map", () => {
    const oldFile = { path: "path1", content: "code1" };
    const newFile = { path: "path2", content: "code2" };
    fileMap.set(oldFile);

    fileMap.replace(oldFile, newFile);

    expect(fileMap.get("path1")).toBeUndefined();
    expect(fileMap.get("path2")).toBe(newFile);
  });

  test("replaceFilesPath should replace all file paths using a function", async () => {
    const file1 = { path: "path1", content: "code1" };
    const file2 = { path: "path2", content: "code2" };
    fileMap.set(file1);
    fileMap.set(file2);
    const newPath = "newPath";

    fileMap.replaceFilesPath((path) => join(newPath, path));

    expect(Array.from(fileMap.getAll())).toStrictEqual([
      { path: "newPath/path1", content: "code1" },
      { path: "newPath/path2", content: "code2" },
    ]);
  });

  test("replaceFilesCode should replace all file codes using a function", async () => {
    const file1 = { path: "path1", content: "code1" };
    const file2 = { path: "path2", content: "code2" };
    fileMap.set(file1);
    fileMap.set(file2);
    const newCode = "newCode";

    await fileMap.replaceFilesCode(() => newCode);

    expect(fileMap.get("path1")?.content).toBe(newCode);
    expect(fileMap.get("path2")?.content).toBe(newCode);
  });

  test("removeMany should remove files from the map", () => {
    const file1 = { path: "path1", content: "code1" };
    const file2 = { path: "path2", content: "code2" };
    fileMap.set(file1);
    fileMap.set(file2);

    fileMap.removeMany(["path1"]);

    expect(fileMap.get("path1")).toBeUndefined();
  });

  test("files should return an array of files", () => {
    const file1 = { path: "path1", content: "code1" };
    const file2 = { path: "path2", content: "code2" };
    fileMap.set(file1);
    fileMap.set(file2);

    const result = Array.from(fileMap.getAll());

    expect(result).toEqual([file1, file2]);
  });
});
