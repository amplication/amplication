import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TemplateModuleBase } from "./base/template.module.base";
import { TemplateService } from "./template.service";
import { TemplateResolver } from "./template.resolver";
import { OpenaiService } from "../../providers/openai/openai.service";

@Module({
  imports: [TemplateModuleBase, forwardRef(() => AuthModule)],
  providers: [TemplateService, TemplateResolver, OpenaiService],
  exports: [TemplateService],
})
export class TemplateModule {}
