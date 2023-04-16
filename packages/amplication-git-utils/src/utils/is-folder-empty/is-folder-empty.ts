import { readdir } from "fs/promises";

/**
 * This function checks if the folder is empty
 * @param path The absolute path of the folder
 * @returns true if the folder is empty, false otherwise
 */

export async function isFolderEmpty(path: string): Promise<boolean> {
  const folderContact = await readdir(path);
  if (folderContact.length > 0) {
    return false;
  }
  return true;
}
