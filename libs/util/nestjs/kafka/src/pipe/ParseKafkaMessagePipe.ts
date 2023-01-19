import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from "@amplication/nest-logger-module";
import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import {
  DecodedKafkaMessage,
  IKafkaMessageSerializer,
  KafkaMessage,
  KAFKA_SERIALIZER,
} from "@amplication/util/kafka";

@Injectable()
export class ParseKafkaMessagePipe
  implements PipeTransform<KafkaMessage, Promise<DecodedKafkaMessage>>
{
  constructor(
    @Inject(KAFKA_SERIALIZER)
    private serializerService: IKafkaMessageSerializer,
    @Inject(AMPLICATION_LOGGER_PROVIDER)
    private readonly logger: AmplicationLogger
  ) {}

  async transform(value: KafkaMessage): Promise<DecodedKafkaMessage> {
    try {
      const message = await this.serializerService.deserialize(value);
      return message;
    } catch (error) {
      this.logger.error("Failed to deserialize kafka message", {
        value,
      });
      throw new BadRequestException("Failed to deserialize kafka message");
    }
  }
}
