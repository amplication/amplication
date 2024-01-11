import { generateKafkaClientOptions } from "./kafka/generateKafkaClientOptions";
import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MicroserviceOptions } from "@nestjs/microservices";

export async function connectMicroservices(app: INestApplication) {
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>(
    generateKafkaClientOptions(configService)
  );
}
