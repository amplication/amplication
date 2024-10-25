import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { InjectContextValue } from "../../decorators/injectContextValue.decorator";
import { Roles } from "../../decorators/roles.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { FindOneArgs } from "../../dto";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { InjectableOriginParameter } from "../../enums/InjectableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Team, User } from "../../models";
import { TeamCreateArgs } from "./dto/TeamCreateArgs";
import { TeamFindManyArgs } from "./dto/TeamFindManyArgs";
import { UpdateTeamArgs } from "./dto/UpdateTeamArgs";
import { TeamService } from "./team.service";
import { AddMembersToTeamArgs } from "./dto/AddMembersToTeamArgs";
import { RemoveMembersFromTeamArgs } from "./dto/RemoveMembersFromTeamArgs";

@Resolver(() => Team)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class TeamResolver {
  constructor(private teamService: TeamService) {}

  @Query(() => [Team], { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "where.workspace.id"
  )
  async teams(@Args() args: TeamFindManyArgs): Promise<Team[]> {
    return this.teamService.teams(args);
  }

  @Query(() => Team, { nullable: true })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.TeamId, "where.id")
  async team(@Args() args: FindOneArgs): Promise<Team | null> {
    return this.teamService.team(args);
  }

  @Mutation(() => Team, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "data.workspace.connect.id"
  )
  async createTeam(
    @Args() args: TeamCreateArgs,
    @UserEntity() user: User
  ): Promise<Team> {
    return this.teamService.createTeam(args);
  }

  @Mutation(() => Team, { nullable: true })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.TeamId, "where.id")
  async deleteTeam(@Args() args: FindOneArgs): Promise<Team | null> {
    return this.teamService.deleteTeam(args);
  }

  @Mutation(() => Team, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.TeamId, "where.id")
  async updateTeam(@Args() args: UpdateTeamArgs): Promise<Team> {
    return this.teamService.updateTeam(args);
  }

  @Mutation(() => Team, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.TeamId, "where.id")
  async addMembersToTeam(@Args() args: AddMembersToTeamArgs): Promise<Team> {
    return this.teamService.addMembersToTeam(args);
  }

  @Mutation(() => Team, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.TeamId, "where.id")
  async removeMembersFromTeam(
    @Args() args: RemoveMembersFromTeamArgs
  ): Promise<Team> {
    return this.teamService.removeMembersFromTeam(args);
  }
}
