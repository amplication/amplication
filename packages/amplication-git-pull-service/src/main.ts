import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

const CLIENT_ID_KEY = "CLIENT_ID_ENV" || "repository-pull";
const BROKER_IP_KEY = "BROKER_IP_ENV";
const GROUP_ID_KEY = "GROUP_ID_ENV" || "git-pull-event";

async function main() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: CLIENT_ID_KEY,
          brokers: ["localhost:9092"],
        },
        consumer: {
          groupId: GROUP_ID_KEY,
        },
      },
    }
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.listen();

  return app;
}

module.exports = main();
