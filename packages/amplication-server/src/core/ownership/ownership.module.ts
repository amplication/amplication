import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { OwnershipService } from "./ownership.service";

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [OwnershipService],
  exports: [OwnershipService],
})
export class OwnershipModule {}
