import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { BlueprintResolver } from "./blueprint.resolver";
import { BlueprintService } from "./blueprint.service";

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [BlueprintResolver, BlueprintService],
  exports: [BlueprintResolver, BlueprintService],
})
export class BlueprintModule {}
