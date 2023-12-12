import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { TemplateModuleBase } from "./base/template.module.base";
import { TemplateService } from "./template.service";
import { TemplateResolver } from "./template.resolver";

@Module({
  imports: [TemplateModuleBase, forwardRef(() => AuthModule)],
  providers: [TemplateService, TemplateResolver],
  exports: [TemplateService],
})
export class TemplateModule {}
