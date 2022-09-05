import { join } from 'path';

export const BUILDS_FOLDER_PATH_ENV_KEY = 'BASE_BUILDS_FOLDER';
export const GENERATE_PULL_REQUEST_TOPIC = 'GENERATE_PULL_REQUEST_TOPIC';
export const DOT_AMPLICATION_FOLDER = join(
  process.cwd(),
  '..',
  '..',
  '.amplication'
);
export const DEFAULT_BUILDS_FOLDER = join(
  DOT_AMPLICATION_FOLDER,
  'storage',
  'builds'
);
export const SERVICE_NAME = 'amplication-git-pull-request-service';

export type PrModule = {
  path: string;
  code: string | null;
};
