import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createNestjsKafkaConfig } from '@amplication/kafka';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(createNestjsKafkaConfig());

  await app.startAllMicroservices();
  await app.listen(5000);
}
bootstrap();
