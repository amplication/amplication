export const STORAGE_DIRECTORY = 'generated-applications';

export function getBuildFilePath(buildId: string): string {
  const fileName = `${buildId}.zip`;
  return [STORAGE_DIRECTORY, fileName].join('/');
}
