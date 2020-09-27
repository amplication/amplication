import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  /**
   * Cloud Tracing @see https://cloud.google.com/trace/docs
   */
  if (process.env.ENABLE_CLOUD_TRACING) {
    const traceAgent = await import('@google-cloud/trace-agent');
    traceAgent.start();
    console.info('Cloud tracing is enabled');
  }

  const app = await NestFactory.create(AppModule, {});

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Cors
  if (process.env.CORS_ENABLE === '1') {
    app.enableCors();
  }

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
