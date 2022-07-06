import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FindOneArgs } from 'src/dto';
import { Project } from 'src/models';
import { CreateProjectArgs } from './dto/create-project.args';
import { ProjectFindManyArgs } from './dto/project-find-many.args';
import { ProjectService } from './project.service';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Query(() => Project, { nullable: true })
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
  async createWorkspace(
    // @UserEntity() currentUser: User,
    @Args() args: CreateProjectArgs
  ): Promise<Project | null> {
    return this.projectService.createProject(args);
  }
}
