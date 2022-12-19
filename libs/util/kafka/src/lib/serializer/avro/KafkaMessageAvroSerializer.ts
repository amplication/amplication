import { plainToInstance } from "class-transformer";
import type {
  Logger,
  SchemaIds,
  IKafkaMessageSerializer,
  DecodedKafkaMessage,
  KafkaMessage,
  Json,
} from "../../../types";
import { SchemaRegistryConfig } from "../../../types";
// import { SchemaRegistry } from "confluent-schema-registry";

class KafkaMessageAvroSerializer implements IKafkaMessageSerializer {
  private logger: Logger;
  private schemaRegistry;

  public constructor(
    schemaRegistryConfig: SchemaRegistryConfig,
    logger?: Logger
  ) {
    const { host, username, password } = schemaRegistryConfig;
    // this.schemaRegistry = new SchemaRegistry({
    //   host,
    //   auth: {
    //     username,
    //     password,
    //   },
    // });
    this.schemaRegistry = {};
    this.logger = logger ?? console;
  }

  private isAvroEncoded = (buffer: Buffer): boolean =>
    buffer.length > 0 && buffer.slice(0, 1).readInt8(0) === 0;

  private async decodeKafkaField(
    kafkaFieldBuffer: Buffer | null
  ): Promise<string | Json | undefined> {
    if (!kafkaFieldBuffer) {
      return;
    }

    let kafkaField;

    if (this.isAvroEncoded(kafkaFieldBuffer)) {
      // kafkaField = await this.schemaRegistry.decode(kafkaFieldBuffer);
      throw new Error("Avro payload is not supported yet");
    }

    return kafkaField;
  }

  public async deserialize(
    message: KafkaMessage
  ): Promise<DecodedKafkaMessage> {
    const logContext = [];
    const { key, value } = message;

    const kafkaMessageKey = await this.decodeKafkaField(key);
    logContext.push({ decodedKey: kafkaMessageKey });

    const kafkaMessageValue = await this.decodeKafkaField(value);
    logContext.push({ decodedValue: kafkaMessageValue });

    return {
      key: kafkaMessageKey,
      value: kafkaMessageValue ?? null,
    };
  }

  private async serialiseField(
    field?: string | Json,
    schemaId?: number
  ): Promise<Buffer | undefined> {
    let serialised: Buffer | undefined;

    if (typeof field === "undefined") {
      serialised = undefined;
    } else if (schemaId) {
      if (!this.schemaRegistry) {
        throw new Error(
          "A schemaRegistry was not provided to the Kafka constructor, but is required when serialising a field with a schemaId"
        );
      }
      // serialised = await this.schemaRegistry.encode(schemaId, field);
      throw new Error("Avro payload is not supported yet");
    } else {
      throw new Error("A schema ID must be provided for Object payloads");
    }

    return serialised;
  }

  public async serialize(
    message: DecodedKafkaMessage,
    schemaIds?: SchemaIds
  ): Promise<KafkaMessage> {
    const keyPromise = this.serialiseField(message.key, schemaIds?.keySchemaId);

    const valuePromise = this.serialiseField(
      message.value ?? undefined,
      schemaIds?.valueSchemaId
    );

    const [key, value] = await Promise.all([keyPromise, valuePromise]);
    const { headers } = message;

    return {
      key: key ?? null,
      value: value ?? null,
      headers,
    };
  }
}

export { KafkaMessageAvroSerializer };
