import { PrismaModule } from "../../prisma";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserActionModule } from "../userAction/userActionModule";
import { AiController } from "./ai.controller";
import { AiResolver } from "./ai.resolver";
import { AiService } from "./ai.service";
import { PromptManagerService } from "./prompt-manager.service";
import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";

@Module({
  controllers: [AiController],
  imports: [UserActionModule, KafkaModule, PermissionsModule, PrismaModule],
  providers: [AiResolver, AiService, PromptManagerService],
  exports: [AiResolver, AiService, PromptManagerService],
})
export class AiModule {}
