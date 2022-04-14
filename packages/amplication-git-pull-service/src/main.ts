import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

const CLIENT_ID_KEY = "KAFKA_CLIENT_ID";
const BROKER_IP_KEY = "KAFKA_BROKERS";
const GROUP_ID_KEY = "KAFKA_CONSUMER_GROUP";

async function main() {
  // create a 'dummy' app to be able to get a reference to the config service
  const configApp = await NestFactory.create(AppModule);

  let configService = configApp.get(ConfigService);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: configService.get<string>(CLIENT_ID_KEY),
          brokers: JSON.parse(configService.get<any>(BROKER_IP_KEY)),
        },
        consumer: {
          groupId: configService.get<any>(GROUP_ID_KEY),
        },
      },
    }
  );

  app.listen();

  return app;
}

module.exports = main();
