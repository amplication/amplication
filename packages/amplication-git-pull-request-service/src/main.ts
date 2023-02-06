import { AmplicationLogger } from "@amplication/nest-logger-module";
import { createNestjsKafkaConfig } from "@amplication/util/nestjs/kafka";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(AmplicationLogger));
  app.connectMicroservice<MicroserviceOptions>(createNestjsKafkaConfig());

  await app.startAllMicroservices();

  await app.listen(process.env.PORT || 3331);
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
