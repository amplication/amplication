import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";
import { PrivatePluginController } from "./private-plugin.controller";
import { PrivatePluginService } from "./private-plugin.service";

@Module({
  imports: [KafkaModule],
  providers: [PrivatePluginService],
  controllers: [PrivatePluginController],
})
export class PrivatePluginModule {}
