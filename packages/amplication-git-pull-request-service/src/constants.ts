import { join } from 'path';

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
