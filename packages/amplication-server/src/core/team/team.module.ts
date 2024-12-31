import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { TeamResolver } from "./team.resolver";
import { TeamService } from "./team.service";
import { TeamAssignmentResolver } from "./teamAssignment.resolver";
import { ResourceModule } from "../resource/resource.module";

@Module({
  imports: [PrismaModule, PermissionsModule, ResourceModule],
  providers: [TeamResolver, TeamService, TeamAssignmentResolver],
  exports: [TeamResolver, TeamService, TeamAssignmentResolver],
})
export class TeamModule {}
