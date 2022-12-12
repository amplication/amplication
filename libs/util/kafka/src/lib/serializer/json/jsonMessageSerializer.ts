import type {
  DecodedKafkaMessage,
  IKafkaMessageSerializer,
  Json,
  KafkaMessage,
} from "../../../types";

class KafkaMessageSerializer implements IKafkaMessageSerializer {
  public async deserialize(
    message: KafkaMessage
  ): Promise<DecodedKafkaMessage> {
    const { key, value, headers } = message;

    return {
      key: key?.toString("utf8"),
      value: value?.toString("utf8") ?? null,
      headers,
    };
  }

  private serialiseField(field?: string | Json): Buffer | undefined {
    let serialised: Buffer | undefined;

    if (typeof field === "undefined") {
      serialised = undefined;
    } else if (typeof field === "string") {
      serialised = Buffer.from(field, "utf-8");
    } else {
      const stringVal = JSON.stringify(field);
      serialised = Buffer.from(stringVal, "utf-8");
    }

    return serialised;
  }

  public async serialize(message: DecodedKafkaMessage): Promise<KafkaMessage> {
    const { key: decodedKey, value: decodedValue, headers } = message;
    const key = this.serialiseField(decodedKey) ?? null;

    const value = decodedValue ? this.serialiseField(decodedValue) : null;

    return {
      key,
      value: value ?? null,
      headers,
    };
  }
}

export default KafkaMessageSerializer;
