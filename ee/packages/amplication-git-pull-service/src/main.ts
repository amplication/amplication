import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions } from "@nestjs/microservices";

@Module({})
class AppModule {}

async function main() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule
  );

  app.listen();

  return app;
}

module.exports = main();
