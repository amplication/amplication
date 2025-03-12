import { Module, forwardRef } from "@nestjs/common";
import { RelationService } from "./relation.service";
import { RelationResolver } from "./relation.resolver";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserModule } from "../user/user.module";
import { BlueprintModule } from "../blueprint/blueprint.module";
import { PrismaModule } from "../../prisma";
@Module({
  imports: [
    UserModule,
    BlockModule,
    PermissionsModule,
    PrismaModule,
    forwardRef(() => BlueprintModule),
  ],
  providers: [RelationService, RelationResolver],
  exports: [RelationService, RelationResolver],
})
export class RelationModule {}
