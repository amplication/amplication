import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Swagger Api
  if (process.env.SWAGGER_ENABLE === '1') {
    const options = new DocumentBuilder()
      .setTitle(process.env.SWAGGER_TITLE || 'Nestjs')
      .setDescription(
        process.env.SWAGGER_DESCRIPTION || 'The nestjs API description'
      )
      .setVersion(process.env.SWAGGER_VERSION || '1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(process.env.SWAGGER_PATH || 'api', app, document);
  }

  // Cors
  if (process.env.CORS_ENABLE === '1') {
    app.enableCors();
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
