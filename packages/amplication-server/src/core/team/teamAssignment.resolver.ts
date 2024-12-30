import { UseFilters, UseGuards } from "@nestjs/common";
import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Resource, Role, Team } from "../../models";
import { TeamAssignment } from "../../models/TeamAssignment";
import { ResourceService } from "../resource/resource.service";
import { TeamService } from "./team.service";

@Resolver(() => TeamAssignment)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class TeamAssignmentResolver {
  constructor(
    private teamService: TeamService,
    private resourceService: ResourceService
  ) {}

  @ResolveField(() => [Role], { nullable: false })
  async roles(@Parent() parent: TeamAssignment): Promise<Role[]> {
    return this.teamService.getTeamAssignmentRoles({
      teamId: parent.teamId,
      resourceId: parent.resourceId,
    });
  }

  @ResolveField(() => Resource, { nullable: false })
  async resource(@Parent() parent: TeamAssignment): Promise<Resource> {
    return this.resourceService.resource({
      where: { id: parent.resourceId },
    });
  }

  @ResolveField(() => Team, { nullable: false })
  async team(@Parent() parent: TeamAssignment): Promise<Team> {
    return this.teamService.team({
      where: { id: parent.teamId },
    });
  }
}
