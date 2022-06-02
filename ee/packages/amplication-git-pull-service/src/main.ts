import { createNestjsKafkaConfig } from '@amplication/kafka';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function main() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    createNestjsKafkaConfig()
  );

  app.listen();

  return app;
}

module.exports = main();
