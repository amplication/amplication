import { StorageModule } from '@codebrew/nestjs-storage';
import { ConfigModule } from '@nestjs/config';
import { StorageOptionsService } from './storage-options.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const RootStorageModule = StorageModule.forRootAsync({
  imports: [ConfigModule],
  useClass: StorageOptionsService
});
