import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { EnvironmentService } from "./environment.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvironmentModule {}
