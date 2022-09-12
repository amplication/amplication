import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
//@ts-ignore
import { generateKafkaClientOptions } from "./generateKafkaClientOptions";
//@ts-ignore
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
