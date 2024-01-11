import { PrismaModule } from "../../prisma/prisma.module";
import { BlockModule } from "../block/block.module";
import { BuildModule } from "../build/build.module";
import { EntityModule } from "../entity/entity.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserModule } from "../user/user.module";
import { CommitResolver } from "./commit.resolver";
import { CommitService } from "./commit.service";
import { forwardRef, Module } from "@nestjs/common";

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PermissionsModule,
    forwardRef(() => BuildModule),
    EntityModule,
    BlockModule,
  ],
  providers: [CommitService, CommitResolver],
  exports: [CommitService, CommitResolver],
})
export class CommitModule {}
