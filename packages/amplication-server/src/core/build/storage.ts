export const STORAGE_DIRECTORY = 'generated-applications';

export function getBuildZipFilePath(buildId: string): string {
  const fileName = `${buildId}.zip`;
  return [STORAGE_DIRECTORY, fileName].join('/');
}

export function getBuildTarGzFilePath(buildId: string): string {
  const fileName = `${buildId}.tar.gz`;
  return [STORAGE_DIRECTORY, fileName].join('/');
}
