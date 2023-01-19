import { IHeaders, KafkaMessage as FullKafkaMessage } from "kafkajs";

export type Json = Record<string, unknown>;

export interface DecodedKafkaMessage {
  key: string | Json | null;
  value: string | Json | null;
  headers?: IHeaders;
}

export type KafkaMessage = Pick<FullKafkaMessage, "key" | "value" | "headers">;

export type SchemaIds = { keySchemaId?: number; valueSchemaId?: number };
