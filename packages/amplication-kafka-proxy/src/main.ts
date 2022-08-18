import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateKafkaConfig } from './utils/generate-kafka-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('env', process.env.KAFKA_BROKERS);
  app.connectMicroservice(generateKafkaConfig());
  app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
