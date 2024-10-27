import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { TeamResolver } from "./team.resolver";
import { TeamService } from "./team.service";

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [TeamResolver, TeamService],
  exports: [TeamResolver, TeamService],
})
export class TeamModule {}
