import { FsStorageProvider } from '../lib/providers/storage-provider.service';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { dirname } from 'path';

beforeEach(() => {
  deleteFolder('tmp');
});

afterEach(() => {
  deleteFolder('tmp');
});

describe('directoryContains', () => {
  // test stuff

  test('should return that a folder contains a file from the files list', () => {
    //ARRANGE
    writeFile('tmp/b/c/Dockerfile', '');
    const storageProvider = new FsStorageProvider();
    //ACT
    const results = storageProvider.directoryContains('tmp/b/c', [
      'Dockerfile',
    ]);
    //ASSERT
    expect(results).toBe(true);
  });

  test('should return that a folder not contains a file from the files list', () => {
    //ARRANGE
    writeFile('tmp/b/c/Dockerfile', '');
    const storageProvider = new FsStorageProvider();
    //ACT
    const results = storageProvider.directoryContains('tmp/b/c', [
      'Dockerfile-2',
    ]);
    //ASSERT
    expect(results).toBe(false);
  });

  test('should return that a folder contains a file from the files list - multiple files to search', () => {
    //ARRANGE
    writeFile('tmp/b/c/Dockerfile', '');
    const storageProvider = new FsStorageProvider();
    //ACT
    const results = storageProvider.directoryContains('tmp/b/c', [
      'Dockerfile-2',
      'Dockerfile',
    ]);
    //ASSERT
    expect(results).toBe(true);
  });

  test('should return that a folder not contains a file from the files list - multiple files to search', () => {
    //ARRANGE
    writeFile('tmp/b/c/Dockerfile', '');
    const storageProvider = new FsStorageProvider();
    //ACT
    const results = storageProvider.directoryContains('tmp/b/c', [
      'Dockerfile-2',
      'Dockerfile-3',
    ]);
    //ASSERT
    expect(results).toBe(false);
  });

  test('should return that a folder not contains a file from the files list - empty search files list', () => {
    //ARRANGE
    writeFile('tmp/b/c/Dockerfile', '');
    const storageProvider = new FsStorageProvider();
    //ACT
    const results = storageProvider.directoryContains('tmp/b/c', []);
    //ASSERT
    expect(results).toBe(false);
  });
});

describe('getSubDirectories', () => {
  // test stuff

  test('should return a folder sub-directories - single subdirectory', () => {
    //ARRANGE
    writeFile('tmp/b/c/Dockerfile', '');
    const storageProvider = new FsStorageProvider();
    //ACT
    const results = storageProvider.getSubDirectories('tmp');
    //ASSERT
    expect(results).toEqual(['b']);
  });

  test('should return a folder sub-directories - multiple subdirectory', () => {
    //ARRANGE
    writeFile('tmp/b/c/Dockerfile', '');
    writeFile('tmp/e/c/Dockerfile', '');
    const storageProvider = new FsStorageProvider();
    //ACT
    const results = storageProvider.getSubDirectories('tmp');
    //ASSERT
    expect(results).toEqual(['b', 'e']);
  });

  test('should return a folder sub-directories - multiple subdirectory and a file', () => {
    //ARRANGE
    writeFile('tmp/b/c/Dockerfile', '');
    writeFile('tmp/e/c/Dockerfile', '');
    writeFile('tmp/Dockerfile', '');
    const storageProvider = new FsStorageProvider();
    //ACT
    const results = storageProvider.getSubDirectories('tmp');
    //ASSERT
    expect(results).toEqual(['b', 'e']);
  });

  test('should return a folder sub-directories - no sub-directories', () => {
    //ARRANGE
    writeFile('tmp/Dockerfile', '');
    const storageProvider = new FsStorageProvider();
    //ACT
    const results = storageProvider.getSubDirectories('tmp');
    //ASSERT
    expect(results).toEqual([]);
  });
});

const deleteFolder = (path: string): void => {
  rmSync(path, { recursive: true, force: true });
};

const writeFile = (path: string, contents: string): void => {
  console.log(dirname(path));
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents, { encoding: 'utf-8' });
};
