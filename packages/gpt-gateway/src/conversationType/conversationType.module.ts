import { AuthModule } from "../auth/auth.module";
import { TemplateModule } from "../template/template.module";
import { ConversationTypeModuleBase } from "./base/conversationType.module.base";
import { ConversationTypeResolver } from "./conversationType.resolver";
import { ConversationTypeService } from "./conversationType.service";
import { Module, forwardRef } from "@nestjs/common";

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
