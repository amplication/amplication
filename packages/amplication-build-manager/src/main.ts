import { Env } from "./env";
import { Tracing } from "@amplication/util/nestjs/tracing";
Tracing.init({
  serviceName: Env.SERVICE_NAME,
});
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { createNestjsKafkaConfig } from "@amplication/util/nestjs/kafka";
import { ConfigService } from "@nestjs/config";

import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(AmplicationLogger));

  app.connectMicroservice<MicroserviceOptions>(createNestjsKafkaConfig());

  await app.startAllMicroservices();

  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get(Env.PORT);
  await app.listen(port);
}
bootstrap();
