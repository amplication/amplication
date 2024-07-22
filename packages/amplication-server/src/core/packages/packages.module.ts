import { Module } from "@nestjs/common";
import { PackagesService } from "./packages.service";
import { PackagesResolver } from "./packages.resolver";
import { ResourceModule } from "../resource/resource.module";
import { BlockModule } from "../block/block.module";
import { UserModule } from "../user/user.module";
import { PermissionsModule } from "../permissions/permissions.module";

@Module({
  imports: [ResourceModule, BlockModule, UserModule, PermissionsModule],
  providers: [PackagesService, PackagesResolver],
  exports: [PackagesService, PackagesResolver],
})
export class PackagesModule {}
