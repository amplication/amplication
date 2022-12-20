import { AmplicationLogger } from "@amplication/nest-logger-module";
import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import {
  DecodedKafkaMessage,
  IKafkaMessageSerializer,
  KafkaMessage,
} from "@amplication/util/kafka";

@Injectable()
export class ParseKafkaMessagePipe
  implements PipeTransform<KafkaMessage, Promise<DecodedKafkaMessage>>
{
  constructor(
    private serializerService: IKafkaMessageSerializer,
    private logger: AmplicationLogger
  ) {}

  async transform(value: KafkaMessage): Promise<DecodedKafkaMessage> {
    try {
      return this.serializerService.deserialize(value);
    } catch (error) {
      this.logger.error("Failed to deserialize kafka message", {
        value,
      });
      throw new BadRequestException("Failed to deserialize kafka message");
    }
  }
}
