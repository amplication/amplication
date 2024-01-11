import { AppModule } from "./app.module";
import { createNestjsKafkaConfig } from "@amplication/util/nestjs/kafka";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";

async function main() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(AmplicationLogger));
  app.connectMicroservice<MicroserviceOptions>(createNestjsKafkaConfig());

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3333);

  return app;
}

module.exports = main();
