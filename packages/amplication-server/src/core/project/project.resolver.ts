import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from '@nestjs/graphql';
import { FindOneArgs } from 'src/dto';
import { Commit, Project, Resource, User } from 'src/models';
import { ProjectCreateArgs } from './dto/ProjectCreateArgs';
import { ProjectFindManyArgs } from './dto/ProjectFindManyArgs';
import { ProjectService } from './project.service';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { InjectableOriginParameter } from 'src/enums/InjectableOriginParameter';
import { Roles } from 'src/decorators/roles.decorator';
import { UseFilters, UseGuards } from '@nestjs/common';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableOriginParameter } from 'src/enums/AuthorizableOriginParameter';
import { UserEntity } from 'src/decorators/user.decorator';
import { ResourceService } from '../resource/resource.service';
import {
  CreateCommitArgs,
  DiscardPendingChangesArgs,
  FindPendingChangesArgs,
  PendingChange
} from '../resource/dto';

@Resolver(() => Project)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ProjectResolver {
  constructor(
    private projectService: ProjectService,
    private resourceService: ResourceService
  ) {}

  @Query(() => [Project], { nullable: false })
  @Roles('ORGANIZATION_ADMIN')
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    'where.workspace.id'
  )
  async projects(@Args() args: ProjectFindManyArgs): Promise<Project[]> {
    return this.projectService.findProjects(args);
  }

  @Query(() => Project, { nullable: true })
  @Roles('ORGANIZATION_ADMIN')
  @AuthorizeContext(AuthorizableOriginParameter.ProjectId, 'where.id')
  async project(@Args() args: FindOneArgs): Promise<Project | null> {
    return this.projectService.findProject(args);
  }

  @Mutation(() => Project, { nullable: false })
  @Roles('ORGANIZATION_ADMIN')
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    'data.workspace.connect.id'
  )
  async createProject(
    @Args() args: ProjectCreateArgs,
    @UserEntity() user: User
  ): Promise<Project> {
    return this.projectService.createProject(args, user.id);
  }

  @ResolveField(() => [Resource])
  async resources(@Parent() project: Project): Promise<Resource[]> {
    return this.resourceService.resources({
      where: { project: { id: project.id } }
    });
  }

  /** pending changes and commit */

  @Mutation(() => Commit, {
    nullable: true
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.ProjectId,
    'data.project.connect.id'
  )
  @InjectContextValue(InjectableOriginParameter.UserId, 'data.user.connect.id')
  async commit(@Args() args: CreateCommitArgs): Promise<Commit | null> {
    return this.projectService.commit(args);
  }

  @Mutation(() => Boolean, {
    nullable: true
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.ProjectId,
    'data.project.connect.id'
  )
  @InjectContextValue(InjectableOriginParameter.UserId, 'data.user.connect.id')
  async discardPendingChanges(
    @Args() args: DiscardPendingChangesArgs
  ): Promise<boolean | null> {
    return this.projectService.discardPendingChanges(args);
  }

  @Query(() => [PendingChange], {
    nullable: false
  })
  @AuthorizeContext(AuthorizableOriginParameter.ProjectId, 'where.project.id')
  async pendingChanges(
    @Args() args: FindPendingChangesArgs,
    @UserEntity() user: User
  ): Promise<PendingChange[]> {
    return this.projectService.getPendingChanges(args, user);
  }
}
