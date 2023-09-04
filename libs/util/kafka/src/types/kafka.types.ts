import { IHeaders, KafkaMessage as FullKafkaMessage } from "kafkajs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Json = Record<string, any>;

export interface DecodedKafkaMessage {
  key: string | Json | null;
  value: string | Json | null;
  headers?: IHeaders;
}

export type KafkaMessage = Pick<FullKafkaMessage, "key" | "value" | "headers">;

export type SchemaIds = { keySchemaId?: number; valueSchemaId?: number };
