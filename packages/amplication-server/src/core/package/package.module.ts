import { Module } from "@nestjs/common";
import { PackageService } from "./package.service";
import { PackageResolver } from "./package.resolver";
import { ResourceModule } from "../resource/resource.module";
import { BlockModule } from "../block/block.module";
import { UserModule } from "../user/user.module";
import { PermissionsModule } from "../permissions/permissions.module";

@Module({
  imports: [ResourceModule, BlockModule, UserModule, PermissionsModule],
  providers: [PackageService, PackageResolver],
  exports: [PackageService, PackageResolver],
})
export class PackageModule {}
