import { PrismaModule } from "../../prisma";
import { ActionModule } from "../action/action.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserActionModule } from "../userAction/userActionModule";
import { AiController } from "./ai.controller";
import { AiResolver } from "./ai.resolver";
import { AiService } from "./ai.service";
import { BtmManagerService } from "./btm-manager.service";
import { PromptManagerService } from "./prompt-manager.service";
import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";

@Module({
  controllers: [AiController],
  imports: [
    ActionModule,
    KafkaModule,
    PermissionsModule,
    PrismaModule,
    UserActionModule,
  ],
  providers: [AiResolver, AiService, BtmManagerService, PromptManagerService],
  exports: [AiResolver, AiService],
})
export class AiModule {}
