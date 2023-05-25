import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { sendServerLoadEvent } from "./util/sendServerLoadEvent";
import { createNestjsKafkaConfig } from "@amplication/util/nestjs/kafka";
import { MicroserviceOptions } from "@nestjs/microservices";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { SERVICE_NAME } from "./constants";
import { Logger } from "@amplication/util/logging";

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

  /**
   * Cloud Tracing @see https://cloud.google.com/trace/docs
   */
  if (process.env.ENABLE_CLOUD_TRACING) {
    const traceAgent = await import("@google-cloud/trace-agent");
    traceAgent.start();
    // eslint-disable-next-line no-console
    console.info("Cloud tracing is enabled");
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(AmplicationLogger));

  app.connectMicroservice<MicroserviceOptions>(createNestjsKafkaConfig());

  await app.startAllMicroservices();

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
  new Logger({ serviceName: SERVICE_NAME, isProduction: true }).error(
    error.message,
    error
  );
  process.exit(1);
});
