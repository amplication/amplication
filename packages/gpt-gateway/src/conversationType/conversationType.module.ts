import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ConversationTypeModuleBase } from "./base/conversationType.module.base";
import { ConversationTypeService } from "./conversationType.service";
import { ConversationTypeResolver } from "./conversationType.resolver";
import { TemplateModule } from "../template/template.module";

@Module({
  imports: [
    ConversationTypeModuleBase,
    forwardRef(() => AuthModule),
    TemplateModule,
  ],
  providers: [ConversationTypeService, ConversationTypeResolver],
  exports: [ConversationTypeService],
})
export class ConversationTypeModule {}
