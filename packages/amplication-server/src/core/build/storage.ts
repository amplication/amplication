import { map } from 'axax';
import { Storage, ContentResponse, FileListResponse } from '@slynova/flydrive';

export const STORAGE_DIRECTORY = 'generated-applications';

export function getBuildDirectory(buildId: string): string {
  return [STORAGE_DIRECTORY, buildId].join('/');
}

type File = { path: string } & ContentResponse<Buffer>;

export function getAll(disk: Storage, directory: string): AsyncIterable<File> {
  const responses = disk.flatList(directory);
  const files = map<FileListResponse, File>(async response => {
    const { path } = response;
    const fileResponse = await disk.getBuffer(path);
    return {
      ...fileResponse,
      path
    };
  })(responses);
  return files;
}
