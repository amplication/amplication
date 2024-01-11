import { AuthModule } from "../auth/auth.module";
import { ModelModuleBase } from "./base/model.module.base";
import { ModelResolver } from "./model.resolver";
import { ModelService } from "./model.service";
import { Module, forwardRef } from "@nestjs/common";

@Module({
  imports: [ModelModuleBase, forwardRef(() => AuthModule)],
  providers: [ModelService, ModelResolver],
  exports: [ModelService],
})
export class ModelModule {}
