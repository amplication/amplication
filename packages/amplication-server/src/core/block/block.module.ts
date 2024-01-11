import { PrismaModule } from "../../prisma/prisma.module";
import { DiffModule } from "../../services/diff.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserModule } from "../user/user.module";
import { BlockResolver } from "./block.resolver";
import { BlockService } from "./block.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule, UserModule, PermissionsModule, DiffModule],
  providers: [BlockService, BlockResolver],
  exports: [BlockService, BlockResolver],
})
export class BlockModule {}
