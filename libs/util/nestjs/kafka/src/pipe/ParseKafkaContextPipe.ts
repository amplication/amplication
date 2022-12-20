import { AmplicationLogger } from "@amplication/nest-logger-module";
import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { KafkaContext } from "@nestjs/microservices";
import { IKafkaMessageSerializer } from "@amplication/util/kafka";
import { DecodedKafkaContext } from "../ctx-host/DecodedKafkaContext";

@Injectable()
export class ParseKafkaContextPipe
  implements PipeTransform<KafkaContext, Promise<DecodedKafkaContext>>
{
  constructor(
    private serializerService: IKafkaMessageSerializer,
    private logger: AmplicationLogger
  ) {}

  async transform(value: KafkaContext): Promise<DecodedKafkaContext> {
    const message = value.getMessage();
    const partition = value.getPartition();
    const topic = value.getTopic();

    try {
      const decodedMessage = await this.serializerService.deserialize(message);

      return new DecodedKafkaContext([decodedMessage, partition, topic]);
    } catch (error) {
      this.logger.error("Failed to deserialize kafka message", {
        message,
        partition,
        topic,
      });
      throw new BadRequestException("Failed to deserialize kafka message");
    }
  }
}
