import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOneArgs } from 'src/dto';
import { Project } from 'src/models';
import { ProjectCreateArgs } from './dto/project-create.args';
import { ProjectFindManyArgs } from './dto/project-find-many.args';
import { ProjectService } from './project.service';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';
import { Roles } from 'src/decorators/roles.decorator';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Query(() => [Project], { nullable: true })
  @Roles('ORGANIZATION_ADMIN')
  async projects(@Args() args: ProjectFindManyArgs): Promise<Project[]> {
    return this.projectService.findProjects(args);
  }

  @Query(() => Project, { nullable: true })
  @Roles('ORGANIZATION_ADMIN')
  async project(@Args() args: FindOneArgs): Promise<Project> {
    return this.projectService.findProject(args);
  }

  @Mutation(() => Project, { nullable: true })
  @Roles('ORGANIZATION_ADMIN')
  @InjectContextValue(
    InjectableResourceParameter.WorkspaceId,
    'data.workspace.connect.id'
  )
  async createProject(
    @Args() args: ProjectCreateArgs
  ): Promise<Project | null> {
    return this.projectService.createProject(args);
  }
}
