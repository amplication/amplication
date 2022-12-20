import type {
  DecodedKafkaMessage,
  IKafkaMessageSerializer,
  Json,
  KafkaMessage,
} from "../../../types";

class KafkaMessageJsonSerializer implements IKafkaMessageSerializer {
  private deserializeField(field: Buffer | null): string | Json | undefined {
    if (field === undefined || field === null) {
      return undefined;
    }
    if (!Buffer.isBuffer(field)) {
      return field;
    }

    // A field with the "leading zero byte" indicates the schema payload.
    // The "content" is possibly binary and should not be touched & parsed.
    if (
      Buffer.isBuffer(field) &&
      field.length > 0 &&
      field.readUInt8(0) === 0
    ) {
      throw new Error(
        "Field failed to deserialize. A field with the leading zero byte indicates the schema payload."
      );
    }

    let result = field.toString("utf8");
    const startChar = result.charAt(0);

    // only try to parse objects and arrays
    if (startChar === "{" || startChar === "[") {
      try {
        result = JSON.parse(field.toString());
      } catch (e) {
        /* empty */
      }
    }
    return result;
  }

  public async deserialize(
    message: KafkaMessage
  ): Promise<DecodedKafkaMessage> {
    const { key: originalKey, value: originalValue, headers } = message;

    return {
      key: this.deserializeField(originalKey),
      value: this.deserializeField(originalValue) ?? null,
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

export { KafkaMessageJsonSerializer };
