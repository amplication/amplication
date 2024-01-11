import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionsService } from "./permissions.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
