import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ConversationTypeModuleBase } from "./base/conversationType.module.base";
import { ConversationTypeService } from "./conversationType.service";
import { ConversationTypeResolver } from "./conversationType.resolver";

@Module({
  imports: [ConversationTypeModuleBase, forwardRef(() => AuthModule)],
  providers: [ConversationTypeService, ConversationTypeResolver],
  exports: [ConversationTypeService],
})
export class ConversationTypeModule {}
