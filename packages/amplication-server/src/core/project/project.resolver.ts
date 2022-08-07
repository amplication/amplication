import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from '@nestjs/graphql';
import { FindOneArgs } from 'src/dto';
import { Project, Resource, User } from 'src/models';
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
    const { name, workspace } = args.data;
    return this.projectService.createProject(
      name,
      workspace.connect.id,
      user.id
    );
  }

  @ResolveField(() => [Resource])
  async resources(@Parent() project: Project): Promise<Resource[]> {
    return this.resourceService.resources({
      where: { project: { id: project.id } }
    });
  }
}
