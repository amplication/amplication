import { UseFilters, UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { InjectContextValue } from "../../decorators/injectContextValue.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { FindOneArgs } from "../../dto";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { InjectableOriginParameter } from "../../enums/InjectableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Role, Team, User } from "../../models";
import { TeamCreateArgs } from "./dto/TeamCreateArgs";
import { TeamFindManyArgs } from "./dto/TeamFindManyArgs";
import { UpdateTeamArgs } from "./dto/UpdateTeamArgs";
import { TeamService } from "./team.service";
import { AddMembersToTeamArgs } from "./dto/AddMembersToTeamArgs";
import { RemoveMembersFromTeamArgs } from "./dto/RemoveMembersFromTeamArgs";
import { AddRolesToTeamArgs } from "./dto/AddRolesToTeamArgs";
import { RemoveRolesFromTeamArgs } from "./dto/RemoveRolesFromTeamArgs";
import { TeamAssignment } from "../../models/TeamAssignment";
import { AddRolesToTeamAssignmentArgs } from "./dto/AddRolesToTeamAssignmentArgs";
import { RemoveRolesFromTeamAssignmentArgs } from "./dto/RemoveRolesFromTeamAssignmentArgs";
import { DeleteTeamAssignmentArgs } from "./dto/DeleteTeamAssignmentArgs";
import { CreateTeamAssignmentsArgs } from "./dto/CreateTeamAssignmentsArgs";
import { AddMemberToTeamsArgs } from "./dto/AddMemberToTeamsArgs";

@Resolver(() => Team)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class TeamResolver {
  constructor(private teamService: TeamService) {}

  @Query(() => [Team], { nullable: false })
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "where.workspace.id"
  )
  async teams(@Args() args: TeamFindManyArgs): Promise<Team[]> {
    return this.teamService.teams(args);
  }

  @Query(() => Team, { nullable: true })
  @AuthorizeContext(AuthorizableOriginParameter.TeamId, "where.id")
  async team(@Args() args: FindOneArgs): Promise<Team | null> {
    return this.teamService.team(args);
  }

  @Mutation(() => Team, { nullable: false })
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "data.workspace.connect.id",
    "team.create"
  )
  async createTeam(
    @Args() args: TeamCreateArgs,
    @UserEntity() user: User
  ): Promise<Team> {
    return this.teamService.createTeam(args);
  }

  @Mutation(() => Team, { nullable: true })
  @AuthorizeContext(
    AuthorizableOriginParameter.TeamId,
    "where.id",
    "team.delete"
  )
  async deleteTeam(@Args() args: FindOneArgs): Promise<Team | null> {
    return this.teamService.deleteTeam(args);
  }

  @Mutation(() => Team, { nullable: false })
  @AuthorizeContext(AuthorizableOriginParameter.TeamId, "where.id", "team.edit")
  async updateTeam(@Args() args: UpdateTeamArgs): Promise<Team> {
    return this.teamService.updateTeam(args);
  }

  @Mutation(() => Team, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.TeamId,
    "where.id",
    "team.member.add"
  )
  async addMembersToTeam(@Args() args: AddMembersToTeamArgs): Promise<Team> {
    return this.teamService.addMembersToTeam(args);
  }

  @Mutation(() => User, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.UserId,
    "where.id",
    "team.member.add"
  )
  async addMemberToTeams(@Args() args: AddMemberToTeamsArgs): Promise<User> {
    return this.teamService.addMemberToTeams(args);
  }

  @Mutation(() => Team, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.TeamId,
    "where.id",
    "team.member.remove"
  )
  async removeMembersFromTeam(
    @Args() args: RemoveMembersFromTeamArgs
  ): Promise<Team> {
    return this.teamService.removeMembersFromTeam(args);
  }

  @ResolveField(() => [User], { nullable: false })
  async members(@Parent() parent: Team): Promise<User[]> {
    return this.teamService.members(parent.id);
  }

  @Mutation(() => Team, { nullable: false })
  @AuthorizeContext(AuthorizableOriginParameter.TeamId, "where.id", "team.edit")
  async addRolesToTeam(@Args() args: AddRolesToTeamArgs): Promise<Team> {
    return this.teamService.addRolesToTeam(args);
  }

  @Mutation(() => Team, { nullable: false })
  @AuthorizeContext(AuthorizableOriginParameter.TeamId, "where.id", "team.edit")
  async removeRolesFromTeam(
    @Args() args: RemoveRolesFromTeamArgs
  ): Promise<Team> {
    return this.teamService.removeRolesFromTeam(args);
  }

  @Mutation(() => TeamAssignment, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.ResourceId,
    "where.resourceId",
    "resource.setPermissions"
  )
  async addRolesToTeamAssignment(
    @Args() args: AddRolesToTeamAssignmentArgs,
    @UserEntity() user: User
  ): Promise<TeamAssignment> {
    return this.teamService.addRolesToTeamAssignment(args, user);
  }

  @Mutation(() => TeamAssignment, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.ResourceId,
    "where.resourceId",
    "resource.setPermissions"
  )
  async removeRolesFromTeamAssignment(
    @Args() args: RemoveRolesFromTeamAssignmentArgs
  ): Promise<TeamAssignment> {
    return this.teamService.removeRolesFromTeamAssignment(args);
  }

  @Mutation(() => TeamAssignment, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.ResourceId,
    "where.resourceId",
    "resource.setPermissions"
  )
  async deleteTeamAssignment(
    @Args() args: DeleteTeamAssignmentArgs
  ): Promise<TeamAssignment> {
    return this.teamService.deleteTeamAssignment(args);
  }

  @Mutation(() => [TeamAssignment], { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.ResourceId,
    "where.resourceId",
    "resource.setPermissions"
  )
  async createTeamAssignments(
    @Args() args: CreateTeamAssignmentsArgs
  ): Promise<TeamAssignment[]> {
    return this.teamService.createTeamAssignments(args);
  }

  @ResolveField(() => [Role], { nullable: false })
  async roles(@Parent() parent: Team): Promise<Role[]> {
    return this.teamService.roles(parent.id);
  }
}
