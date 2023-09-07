import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import {
  createNestjsKafkaConfig,
  KafkaCustomTransport,
} from "@amplication/util/nestjs/kafka";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@amplication/util/logging";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";

import { AppModule } from "./app.module";
import { Env } from "./env";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(AmplicationLogger));

  app.connectMicroservice<MicroserviceOptions>({
    strategy: new KafkaCustomTransport(createNestjsKafkaConfig().options),
  });

  await app.startAllMicroservices();

  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get(Env.PORT);
  await app.listen(port);
}

bootstrap().catch((error) => {
  new Logger({ component: Env.SERVICE_NAME, isProduction: true }).error(
    error.message,
    error
  );
  process.exit(1);
});
