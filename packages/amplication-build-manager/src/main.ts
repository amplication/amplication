import { createNestjsKafkaConfig } from "@amplication/kafka";
import { ConfigService } from "@nestjs/config";

import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";

import { AppModule } from "./app.module";
import { Env } from "./env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.connectMicroservice<MicroserviceOptions>(createNestjsKafkaConfig());

  await app.startAllMicroservices();

  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get(Env.PORT);
  await app.listen(port);
}
bootstrap();
