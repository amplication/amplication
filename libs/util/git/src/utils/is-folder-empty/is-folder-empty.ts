import { readdir } from "fs/promises";

/**
 * This function checks if the folder is empty
 * @param path The absolute path of the folder
 * @returns true if the folder is empty, false otherwise
 */

export async function isFolderEmpty(
  path: string,
  ignore?: string[]
): Promise<boolean> {
  const folderContact = new Set(await readdir(path));
  if (ignore) {
    for (const input of ignore) {
      folderContact.has(input) && folderContact.delete(input);
    }
  }
  if (folderContact.size > 0) {
    return false;
  }
  return true;
}
