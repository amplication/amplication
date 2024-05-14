import { relativeImportPath, filePathToModulePath } from "./module";

describe("relativeImportPath", () => {
  const cases: Array<[string, string, string, string]> = [
    ["same level", "a.js", "b.js", "./b"],
    ["top-level to nested", "a.js", "b/c.js", "./b/c"],
    ["nested to top-level", "a/b.js", "c.js", "../c"],
  ];
  test.each(cases)("%s", (name, from, to, expected) => {
    expect(relativeImportPath(from, to)).toBe(expected);
  });
});

describe("filePathToModulePath", () => {
  const cases: Array<[string, string, string]> = [
    ["absolute", "/a.js", "/a"],
    ["relative", "./a.js", "./a"],
  ];
  test.each(cases)("%s", (name, filePath, expected) => {
    expect(filePathToModulePath(filePath)).toBe(expected);
  });
});
