import { mkdir, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { isFolderEmpty } from "./is-folder-empty";

describe("Testing the is folder empty function", () => {
  it("should return true if the folder is empty", async () => {
    const folder = await join(tmpdir(), "amplication", "test");
    await mkdir(folder, { recursive: true });
    const result = await isFolderEmpty(folder);
    expect(result).toBe(true);
    rm(folder, { recursive: true, force: true });
  });
  it("should return false if the folder is not empty", async () => {
    const result = await isFolderEmpty(__dirname);
    expect(result).toBe(false);
  });
  it("should ignore the files in the ignore array", async () => {
    const folder = await join(tmpdir(), "amplication", "ignore-test");
    const ignoreFolder = ".git";
    await mkdir(folder, { recursive: true });
    await mkdir(join(folder, ignoreFolder), { recursive: true });
    const result = await isFolderEmpty(folder, [ignoreFolder]);
    expect(result).toBe(true);
    rm(folder, { recursive: true, force: true });
  });
});
