import {
  Args,
  Mutation,
  Query,
  Resolver,
  Parent,
  ResolveField
} from '@nestjs/graphql';
import {
  UpdateOneWorkspaceArgs,
  InviteUserArgs,
  CreateOneWorkspaceArgs,
  Invitation,
  WorkspaceMember,
  DeleteUserArgs,
  RevokeInvitationArgs,
  ResendInvitationArgs
} from './dto';
import { FindOneArgs } from 'src/dto';

import { Workspace, App, User } from 'src/models';
import { AppService } from 'src/core/app/app.service';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { UseFilters, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/decorators/user.decorator';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { WorkspaceService } from './workspace.service';
import { AuthorizableOriginParameter } from 'src/enums/AuthorizableOriginParameter';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { GitOrganization } from 'src/models/GitOrganization';
import { Subscription } from '../subscription/dto/Subscription';
@Resolver(() => Workspace)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class WorkspaceResolver {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private readonly appService: AppService
  ) {}

  @Query(() => Workspace, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableOriginParameter.WorkspaceId, 'where.id')
  async workspace(@Args() args: FindOneArgs): Promise<Workspace | null> {
    return this.workspaceService.getWorkspace(args);
  }

  @Query(() => Workspace, {
    nullable: true,
    description: undefined
  })
  async currentWorkspace(
    @UserEntity() currentUser: User
  ): Promise<Workspace | null> {
    return currentUser.workspace;
  }

  @ResolveField(() => [App])
  async apps(@Parent() workspace: Workspace): Promise<App[]> {
    return this.appService.apps({
      where: { workspace: { id: workspace.id } }
    });
  }

  @Mutation(() => Workspace, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableOriginParameter.WorkspaceId, 'where.id')
  async deleteWorkspace(@Args() args: FindOneArgs): Promise<Workspace | null> {
    return this.workspaceService.deleteWorkspace(args);
  }

  @Mutation(() => Workspace, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableOriginParameter.WorkspaceId, 'where.id')
  async updateWorkspace(
    @Args() args: UpdateOneWorkspaceArgs
  ): Promise<Workspace | null> {
    return this.workspaceService.updateWorkspace(args);
  }

  @Mutation(() => Workspace, {
    nullable: true,
    description: undefined
  })
  async createWorkspace(
    @UserEntity() currentUser: User,
    @Args() args: CreateOneWorkspaceArgs
  ): Promise<Workspace | null> {
    return this.workspaceService.createWorkspace(currentUser.account.id, args);
  }

  @Mutation(() => Invitation, {
    nullable: true,
    description: undefined
  })
  async inviteUser(
    @UserEntity() currentUser: User,
    @Args() args: InviteUserArgs
  ): Promise<Invitation> {
    return this.workspaceService.inviteUser(currentUser, args);
  }

  @Mutation(() => Invitation, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableOriginParameter.InvitationId, 'where.id')
  async revokeInvitation(
    @Args() args: RevokeInvitationArgs
  ): Promise<Invitation> {
    return this.workspaceService.revokeInvitation(args);
  }

  @Mutation(() => Invitation, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableOriginParameter.InvitationId, 'where.id')
  async resendInvitation(
    @Args() args: ResendInvitationArgs
  ): Promise<Invitation> {
    return this.workspaceService.resendInvitation(args);
  }

  @Mutation(() => User, {
    nullable: true,
    description: undefined
  })
  async deleteUser(
    @UserEntity() currentUser: User,
    @Args() args: DeleteUserArgs
  ): Promise<User> {
    return this.workspaceService.deleteUser(currentUser, args);
  }

  @Query(() => [WorkspaceMember], {
    nullable: true,
    description: undefined
  })
  async workspaceMembers(
    @UserEntity() currentUser: User
  ): Promise<WorkspaceMember[]> {
    return this.workspaceService.findMembers({
      where: { id: currentUser.workspace.id }
    });
  }

  @ResolveField(() => Subscription, { nullable: true })
  async subscription(@Parent() workspace: Workspace): Promise<Subscription> {
    return this.workspaceService.getSubscription(workspace.id);
  }

  @ResolveField(() => [GitOrganization])
  async gitOrganizations(
    @Parent() workspace: Workspace
  ): Promise<GitOrganization[]> {
    return this.workspaceService.findManyGitOrganizations(workspace.id);
  }
}
