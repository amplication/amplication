import { OpenaiService } from "../../providers/openai/openai.service";
import { AuthModule } from "../auth/auth.module";
import { TemplateModuleBase } from "./base/template.module.base";
import { TemplateResolver } from "./template.resolver";
import { TemplateService } from "./template.service";
import { Module, forwardRef } from "@nestjs/common";

@Module({
  imports: [TemplateModuleBase, forwardRef(() => AuthModule)],
  providers: [TemplateService, TemplateResolver, OpenaiService],
  exports: [TemplateService],
})
export class TemplateModule {}
