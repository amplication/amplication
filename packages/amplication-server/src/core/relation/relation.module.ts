import { Module } from "@nestjs/common";
import { RelationService } from "./relation.service";
import { RelationResolver } from "./relation.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserModule } from "../user/user.module";
@Module({
  imports: [UserModule, BlockModule, PermissionsModule],
  providers: [RelationService, RelationResolver],
  exports: [RelationService, RelationResolver],
})
export class RelationModule {}
