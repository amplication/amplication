import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
// eslint-disable-next-line
// @ts-ignore
// eslint-disable-next-line
import { AppModule } from "./app.module";

const { PORT = 3000 } = process.env;

async function main() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  const options = new DocumentBuilder()
    /** @todo use app name */
    .setTitle("API")
    /** @todo use app description */
    .setDescription("")
    /** @todo use app version */
    .setVersion("1.0")
    .addBasicAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCssUrl: "../swagger.css",
  });

  app.listen(PORT);

  return app;
}

module.exports = main();
