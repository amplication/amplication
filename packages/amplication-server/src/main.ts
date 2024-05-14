import { SERVICE_NAME } from "./constants";
import { Tracing } from "@amplication/util/nestjs/tracing";
Tracing.init({
  serviceName: SERVICE_NAME,
});

import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { graphqlUploadExpress } from "graphql-upload";
import { AppModule } from "./app.module";
import { sendServerLoadEvent } from "./util/sendServerLoadEvent";
import { createNestjsKafkaConfig } from "@amplication/util/nestjs/kafka";
import { MicroserviceOptions } from "@nestjs/microservices";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Logger } from "@amplication/util/logging";
import { OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import {
  swaggerDocumentOptions,
  swaggerPath,
  swaggerSetupOptions,
} from "./swagger";

async function bootstrap() {
  /**
   * Send server load notification:
   * sending runtime environment details.
   *
   * To disable event tracking set DISABLE_EVENT_TRACKING to 1
   *
   * To find more information regarding this feature visit https://docs.amplication.com/
   */
  if (
    !process.env.DISABLE_EVENT_TRACKING ||
    process.env.DISABLE_EVENT_TRACKING == "0"
  ) {
    sendServerLoadEvent();
  }
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(AmplicationLogger));

  app.connectMicroservice<MicroserviceOptions>(createNestjsKafkaConfig());
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));

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

  await app.startAllMicroservices();

  SwaggerModule.setup(swaggerPath, app, document, swaggerSetupOptions);

  if (process.env.ENABLE_SHUTDOWN_HOOKS) {
    // Remove listeners created by Prisma
    process.removeAllListeners("SIGTERM");
    process.removeAllListeners("SIGINT");
    app.enableShutdownHooks();
  }

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    })
  );

  // Cors
  if (process.env.CORS_ENABLE === "1") {
    app.enableCors();
  }

  await app.listen(process.env.PORT || 3000);
}

bootstrap().catch((error) => {
  new Logger({ component: SERVICE_NAME, isProduction: true }).error(
    error.message,
    error
  );
  process.exit(1);
});
