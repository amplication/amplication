import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Transport,
} from '@nestjs/microservices';

@Controller()
export class CommitController {
  constructor(/*@Inject("QUEUE_SERVICE")
                    private readonly kafkaService: ClientKafka*/) {}

  @EventPattern('test-topic')
  async handleCommit(@Ctx() context: KafkaContext) {
    // const {key, value, offset} = context.getMessage()

    console.log(context.getMessage());

    return await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 20000);
    });

    // await this.kafkaService.commitOffsets([{
    //     topic: context.getTopic(),
    //     partition: context.getPartition(),
    //     offset: offset
    // }])
  }
}
