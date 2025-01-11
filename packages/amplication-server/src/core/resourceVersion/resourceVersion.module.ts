import { forwardRef, Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { CommitModule } from "../commit/commit.module";
import { EntityModule } from "../entity/entity.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ResourceModule } from "../resource/resource.module";
import { UserModule } from "../user/user.module";
import { ResourceVersionResolver } from "./resourceVersion.resolver";
import { ResourceVersionService } from "./resourceVersion.service";
import { BlockModule } from "../block/block.module";
import { OutdatedVersionAlertModule } from "../outdatedVersionAlert/outdatedVersionAlert.module";

@Module({
  imports: [
    EntityModule,
    BlockModule,
    PrismaModule,
    PermissionsModule,
    UserModule,
    forwardRef(() => ResourceModule),
    forwardRef(() => CommitModule),
    OutdatedVersionAlertModule,
  ],
  providers: [ResourceVersionService, ResourceVersionResolver],
  exports: [ResourceVersionService, ResourceVersionResolver],
})
export class ResourceVersionModule {}
