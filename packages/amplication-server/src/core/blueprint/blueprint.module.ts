import { Module, forwardRef } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { BlueprintResolver } from "./blueprint.resolver";
import { BlueprintService } from "./blueprint.service";
import { CustomPropertyModule } from "../customProperty/customProperty.module";
import { RelationModule } from "../relation/relation.module";
@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    CustomPropertyModule,
    forwardRef(() => RelationModule),
  ],
  providers: [BlueprintResolver, BlueprintService],
  exports: [BlueprintResolver, BlueprintService],
})
export class BlueprintModule {}
