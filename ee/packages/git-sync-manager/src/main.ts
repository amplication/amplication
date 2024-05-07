import { Env } from "./env";
import { Tracing } from "@amplication/util/nestjs/tracing";
Tracing.init({
  serviceName: Env.SERVICE_NAME,
});
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { createNestjsKafkaConfig } from "@amplication/util/nestjs/kafka";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";
import { Logger } from "@amplication/util/logging";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(AmplicationLogger));
  app.connectMicroservice<MicroserviceOptions>(createNestjsKafkaConfig());

  await app.startAllMicroservices();

  await app.listen(process.env.PORT || 3331);
}

bootstrap().catch((error) => {
  new Logger({ component: Env.SERVICE_NAME, isProduction: true }).error(
    error.message,
    error
  );
  process.exit(1);
});
