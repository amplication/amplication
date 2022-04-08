import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function main() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: "repository-pull",
          brokers: ["localhost:9092"],
        },
        consumer: {
          groupId: "git-pull-event",
        },
      },
    }
  );
  // const app = await NestFactory.create(AppModule, { cors: true });
  // app.setGlobalPrefix("api");
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.listen();

  return app;
}

module.exports = main();
