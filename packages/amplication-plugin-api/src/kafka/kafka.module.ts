import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { generateKafkaClientOptions } from "./generateKafkaClientOptions";
import { KafkaService } from "./kafka.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "KAFKA_CLIENT",
        ...generateKafkaClientOptions(),
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService, ClientsModule],
})
export class KafkaModule {}
