import { ConversationTypeModule } from "../conversationType/conversationType.module";
import { generateKafkaClientOptions } from "./generateKafkaClientOptions";
import { KafkaController } from "./kafka.controller";
import { KafkaProducerService } from "./kafka.producer.service";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory } from "@nestjs/microservices";

@Global()
@Module({
  imports: [ConversationTypeModule],
  providers: [
    {
      provide: "KAFKA_CLIENT",
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(
          generateKafkaClientOptions(configService)
        );
      },
      inject: [ConfigService],
    },
    KafkaProducerService,
  ],
  controllers: [KafkaController],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
