import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME } from './constants';

export const BuildQueueModule = BullModule.registerQueue({
  name: QUEUE_NAME
});
