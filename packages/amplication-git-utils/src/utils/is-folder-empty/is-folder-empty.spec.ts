import { mkdir, rmdir } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { isFolderEmpty } from "./is-folder-empty";

describe("Testing the is folder empty function", () => {
  it("should return true if the folder is empty", async () => {
    const folder = await join(tmpdir(), "amplication", "test");
    await mkdir(folder, { recursive: true });
    const result = await isFolderEmpty(folder);
    expect(result).toBe(true);
    rmdir(folder);
  });
  it("should return false if the folder is not empty", async () => {
    const result = await isFolderEmpty(__dirname);
    expect(result).toBe(false);
  });
});
