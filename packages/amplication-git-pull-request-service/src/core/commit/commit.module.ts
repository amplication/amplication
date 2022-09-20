import { Module } from '@nestjs/common';
import { CommitController } from './commit.controller';
import {
  KafkaConsumerModule,
  KafkaProducerModule,
  JsonClassSerializer,
  StringSerializerService,
} from '@amplication/kafka';
import { DiffModule } from '../diff';
import { CommitsService } from './commits.service';
import { GitClientFactoryModule } from '@amplication/git-service';
import {CommitTopicsConfigDto} from "./dto/commit-topics-config-dto.service";

@Module({
  controllers: [CommitController],
  imports: [
    KafkaProducerModule.register(StringSerializerService, JsonClassSerializer),
    KafkaConsumerModule.register(StringSerializerService, JsonClassSerializer),
    DiffModule,
    GitClientFactoryModule,
  ],
  providers: [CommitsService,CommitTopicsConfigDto],
})
export class CommitModule {}
