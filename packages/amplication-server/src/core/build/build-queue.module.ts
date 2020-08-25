import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME } from './constants';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BuildQueueModule = BullModule.registerQueue({
  name: QUEUE_NAME,
  redis: process.env.REDIS_URL
});
