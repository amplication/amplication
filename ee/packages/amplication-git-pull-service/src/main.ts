import { createNestjsKafkaConfig } from "@amplication/kafka";
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";

@Module({})
class AppModule {}

async function main() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    createNestjsKafkaConfig()
  );

  app.listen();

  return app;
}

module.exports = main();
