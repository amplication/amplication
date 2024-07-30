import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PackageModelModuleBase } from "./base/packageModel.module.base";
import { PackageModelService } from "./packageModel.service";
import { PackageModelController } from "./packageModel.controller";

@Module({
  imports: [PackageModelModuleBase, forwardRef(() => AuthModule)],
  controllers: [PackageModelController],
  providers: [PackageModelService],
  exports: [PackageModelService],
})
export class PackageModelModule {}
