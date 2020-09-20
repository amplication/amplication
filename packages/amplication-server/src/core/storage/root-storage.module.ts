import { StorageModule } from '@codebrew/nestjs-storage';
import { StorageOptionsModule } from './storage-options.module';
import { StorageOptionsService } from './storage-options.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const RootStorageModule = StorageModule.forRootAsync({
  imports: [StorageOptionsModule],
  useClass: StorageOptionsService
});
