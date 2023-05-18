import type {
  DecodedKafkaMessage,
  IKafkaMessageSerializer,
  Json,
  KafkaMessage,
} from "../../../types";

class KafkaMessageJsonSerializer implements IKafkaMessageSerializer {
  private deserializeField(
    field: Buffer | null,
    kafkaMessage: KafkaMessage
  ): string | Json | null {
    if (!Buffer.isBuffer(field)) {
      return field;
    }

    // The "content" is possibly binary and should not be touched & parsed.
    if (
      Buffer.isBuffer(field) &&
      field.length > 0 &&
      field.readUInt8(0) === 0
    ) {
      throw new Error(
        "Field failed to deserialize. The content is possibly binary and cannot be decode. A field with the leading zero byte indicates the schema payload."
      );
    }

    const decodedString = field.toString("utf8");
    const startChar = decodedString.charAt(0);

    // only try to parse objects and arrays
    if (startChar === "{" || startChar === "[") {
      try {
        return JSON.parse(decodedString);
      } catch (e) {
        console.error("KafkaMessageJsonSerializer failed to parse json", {
          field,
          kafkaMessage,
          error: e,
        });
      }
    }
    return decodedString;
  }

  public async deserialize(
    message: KafkaMessage
  ): Promise<DecodedKafkaMessage> {
    const { key: originalKey, value: originalValue, headers } = message;

    return {
      key: this.deserializeField(originalKey, message),
      value: this.deserializeField(originalValue, message),
      headers,
    };
  }

  private serialiseField(field: string | Json | null): Buffer | null {
    if (field === null) {
      return null;
    } else if (typeof field === "string") {
      return Buffer.from(field, "utf-8");
    }

    const stringVal = JSON.stringify(field);
    return Buffer.from(stringVal, "utf-8");
  }

  public async serialize(message: DecodedKafkaMessage): Promise<KafkaMessage> {
    const { key: decodedKey, value: decodedValue, headers } = message;
    const key = this.serialiseField(decodedKey);

    const value = this.serialiseField(decodedValue);

    return {
      key,
      value,
      headers,
    };
  }
}

export { KafkaMessageJsonSerializer };
