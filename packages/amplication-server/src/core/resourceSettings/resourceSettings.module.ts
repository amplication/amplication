import { forwardRef, Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ResourceSettingsResolver } from "./resourceSettings.resolver";
import { ResourceSettingsService } from "./resourceSettings.service";
import { ResourceModule } from "../resource/resource.module";
import { CustomPropertyModule } from "../customProperty/customProperty.module";
import { BlueprintModule } from "../blueprint/blueprint.module";

@Module({
  imports: [
    PrismaModule,
    BlockModule,
    PermissionsModule,
    forwardRef(() => ResourceModule),
    CustomPropertyModule,
    BlueprintModule,
  ],
  providers: [ResourceSettingsService, ResourceSettingsResolver],
  exports: [ResourceSettingsService, ResourceSettingsResolver],
})
export class ResourceSettingsModule {}
