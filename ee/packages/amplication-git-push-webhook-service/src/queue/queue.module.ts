import { createNestjsKafkaConfig } from '@amplication/util/nestjs/kafka';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { GitOrganizationModule } from '../git-organization/git-organization.module';
import { QueueService, QUEUE_SERVICE_NAME } from './queue.service';

@Module({
  imports: [
    GitOrganizationModule,
    ClientsModule.registerAsync([
      {
        name: QUEUE_SERVICE_NAME,
        useFactory: createNestjsKafkaConfig,
      },
    ]),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
