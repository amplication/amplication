import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOneArgs } from 'src/dto';
import { Project, User } from 'src/models';
import { CreateProjectArgs } from './dto/create-project.args';
import { ProjectFindManyArgs } from './dto/project-find-many.args';
import { ProjectService } from './project.service';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';
import { UserEntity } from 'src/decorators/user.decorator';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Query(() => [Project], { nullable: true })
  async projects(@Args() args: ProjectFindManyArgs): Promise<Project[]> {
    return this.projectService.findProjects(args);
  }

  @Query(() => Project, { nullable: true })
  async project(@Args() args: FindOneArgs): Promise<Project> {
    return this.projectService.findProject(args);
  }

  @Mutation(() => Project, {
    nullable: true,
    description: undefined
  })
  @InjectContextValue(
    InjectableResourceParameter.WorkspaceId,
    'data.workspace.connect.id'
  )
  async createProject(
    @Args() args: CreateProjectArgs,
    @UserEntity() user: User
  ): Promise<Project | null> {
    return this.projectService.createProject(args);
  }
}
