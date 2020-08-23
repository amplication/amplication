import * as path from 'path';
import { DriverType, LocalStorageDisk } from '@codebrew/nestjs-storage';

export const local: LocalStorageDisk = {
  driver: DriverType.LOCAL,
  config: {
    root: path.join(process.cwd(), 'artifacts')
  }
};
