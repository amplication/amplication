import { forwardRef, Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { BlockModule } from "../block/block.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ResourceTemplateVersionService } from "./resourceTemplateVersion.service";
import { ResourceModule } from "../resource/resource.module";

@Module({
  imports: [
    PrismaModule,
    BlockModule,
    PermissionsModule,
    forwardRef(() => ResourceModule),
  ],
  providers: [ResourceTemplateVersionService],
  exports: [ResourceTemplateVersionService],
})
export class ResourceTemplateVersionModule {}
