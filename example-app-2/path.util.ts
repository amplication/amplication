import * as path from "path";

export function removeExt(filePath: string): string {
  const parsedPath = path.parse(filePath);
  return path.join(parsedPath.dir, parsedPath.name);
}
