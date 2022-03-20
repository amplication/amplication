import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
// @ts-ignore
// eslint-disable-next-line
import { AppModule } from "./app.module";
import {
  swaggerPath,
  swaggerDocumentOptions,
  swaggerSetupOptions,
  // @ts-ignore
  // eslint-disable-next-line
} from "./swagger";

const { PORT = 3000 } = process.env;

async function main() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);

  SwaggerModule.setup(swaggerPath, app, document, swaggerSetupOptions);

  void app.listen(PORT);

  return app;
}

module.exports = main();
