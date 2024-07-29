import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PackageFileModuleBase } from "./base/packageFile.module.base";
import { PackageFileService } from "./packageFile.service";
import { PackageFileController } from "./packageFile.controller";

@Module({
  imports: [PackageFileModuleBase, forwardRef(() => AuthModule)],
  controllers: [PackageFileController],
  providers: [PackageFileService],
  exports: [PackageFileService],
})
export class PackageFileModule {}
