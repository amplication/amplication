import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import {
  swaggerDocumentOptions,
  swaggerPath,
  swaggerSetupOptions,
} from "./swagger";

const { PORT = 3000 } = process.env;

async function main() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true,
  });
  app.useLogger(app.get(AmplicationLogger));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);

  /** check if there is Public decorator for each path (action) and its method (findMany / findOne) on each controller */
  Object.values((document as OpenAPIObject).paths).forEach((path: any) => {
    Object.values(path).forEach((method: any) => {
      if (
        Array.isArray(method.security) &&
        method.security.includes("isPublic")
      ) {
        method.security = [];
      }
    });
  });

  SwaggerModule.setup(swaggerPath, app, document, swaggerSetupOptions);

  // Cors
  if (process.env.CORS_ENABLE === "1") {
    app.enableCors();
  }

  void app.listen(PORT);

  return app;
}

module.exports = main();
