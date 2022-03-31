import { DynamicModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import {
  ConsumerConfig,
  KafkaConfig,
} from "@nestjs/microservices/external/kafka.interface";
import { plainToInstance } from "class-transformer";
import { NESTJS_SERVICE_NAME } from ".";
import { PullRequestKafkaService } from "./pull-request.service";

export class PullRequestKafkaModule {
  static forRoot(
    client?: Partial<KafkaConfig>,
    consumer?: ConsumerConfig
  ): DynamicModule {
    const clientModule = ClientsModule.register([
      {
        name: NESTJS_SERVICE_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ["localhost:9092"],
            ...client,
          },
          consumer,
        },
      },
    ]);
    if (!clientModule.providers || !clientModule.exports) {
      throw new Error("Missing provider or export");
    }

    return {
      module: PullRequestKafkaModule,
      providers: [
        //@ts-ignore
        {
          ...clientModule.providers[0],
          useValue: plainToInstance(
            PullRequestKafkaService, //@ts-ignore
            clientModule.providers[0].useValue
          ),
        },
      ],
      exports: [
        {
          //@ts-ignore
          ...clientModule.exports[0],
          useValue: plainToInstance(
            PullRequestKafkaService, //@ts-ignore
            clientModule.exports[0].useValue
          ),
        },
      ],
    };
  }
}
