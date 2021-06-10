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
  CreateOneWorkspaceArgs
} from './dto';
import { FindOneArgs } from 'src/dto';

import { Workspace, App, User } from 'src/models';
import { AppService } from 'src/core/app/app.service';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { UseFilters, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/decorators/user.decorator';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { WorkspaceService } from './workspace.service';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';

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
  @AuthorizeContext(AuthorizableResourceParameter.WorkspaceId, 'where.id')
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
  @AuthorizeContext(AuthorizableResourceParameter.WorkspaceId, 'where.id')
  async deleteWorkspace(@Args() args: FindOneArgs): Promise<Workspace | null> {
    return this.workspaceService.deleteWorkspace(args);
  }

  @Mutation(() => Workspace, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.WorkspaceId, 'where.id')
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

  @Mutation(() => User, {
    nullable: true,
    description: undefined
  })
  async inviteUser(
    @UserEntity() currentUser: User,
    @Args() args: InviteUserArgs
  ): Promise<User | null> {
    return this.workspaceService.inviteUser(currentUser, args);
  }
}
