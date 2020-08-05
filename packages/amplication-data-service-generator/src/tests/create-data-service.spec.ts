import * as fs from "fs";
import * as path from "path";
import fg from "fast-glob";
import zip from "lodash.zip";
import { createDataService, Entity } from "..";
import entities from "./entities.json";

const EXPECTED_DIRECTORY = path.join(__dirname, "expected");

async function getExpected(): Promise<{ [path: string]: string }> {
  const paths = await fg(`${EXPECTED_DIRECTORY}/**`, {
    ignore: ["/**/*.d.ts", "/**/*.js", "/**/*.js.map"],
  });
  const files = await Promise.all(
    paths.map((filePath) => fs.promises.readFile(filePath, "utf-8"))
  );
  const relativePaths = paths.map((path) =>
    path.replace(new RegExp(`^${EXPECTED_DIRECTORY}/`), "")
  );
  const pathToCode = Object.fromEntries(zip(relativePaths, files));
  return pathToCode;
}

describe("createDataService", () => {
  test("creates app as expected", async () => {
    const expected = await getExpected();
    const modules = await createDataService(entities as Entity[]);
    const pathToCode = Object.fromEntries(
      modules.map((module) => [module.path, module.code])
    );
    expect(pathToCode).toEqual(expected);
  });
});
