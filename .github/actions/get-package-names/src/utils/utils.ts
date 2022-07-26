import { mkdirSync, writeFileSync, rmSync, readFileSync } from 'fs';
import { dirname } from 'path';

export function readFile(path: string): string {
  return readFileSync(path, { encoding: 'utf-8' });
}

export function writeFile(path: string, contents: string): void {
  console.log(dirname(path));
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents, { encoding: 'utf-8' });
}

export function deleteFolder(path: string): void {
  rmSync(path, { recursive: true, force: true });
}

export function randomString(): string {
  return (Math.random() + 1).toString(36).substring(7);
}
