import { AmplicationLogger } from '@amplication/util/nestjs/logging';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(AmplicationLogger));
  const port = process.env.PORT || 3333;

  await app.listen(port);
  console.log(`Listening to port ${port}`);
}

bootstrap();
