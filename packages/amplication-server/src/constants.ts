import { join } from 'path';

export const BASE_BUILDS_FOLDER = 'BASE_BUILDS_FOLDER';
export const GENERATE_PULL_REQUEST_TOPIC = 'GENERATE_PULL_REQUEST_TOPIC';
export const CHECK_USER_ACCESS_TOPIC = 'CHECK_USER_ACCESS_TOPIC';
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
