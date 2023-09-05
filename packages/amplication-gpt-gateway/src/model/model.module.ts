import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ModelModuleBase } from "./base/model.module.base";
import { ModelService } from "./model.service";
import { ModelResolver } from "./model.resolver";

@Module({
  imports: [ModelModuleBase, forwardRef(() => AuthModule)],
  providers: [ModelService, ModelResolver],
  exports: [ModelService],
})
export class ModelModule {}
