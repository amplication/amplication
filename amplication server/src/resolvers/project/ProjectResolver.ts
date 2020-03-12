import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { CreateOneProjectArgs,FindManyProjectArgs,FindOneArgs,UpdateOneProjectArgs } from '../../dto/args';
import { Project } from '../../models';
import { ProjectService} from '../../core/project';


@Resolver(_of => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(_returns => Project, {
    nullable: true,
    description: undefined
  })
  async project(@Context() ctx: any, @Args() args: FindOneArgs): Promise<Project | null> {
    return this.projectService.project(args);
  }

  @Query(_returns => [Project], {
    nullable: false,
    description: undefined
  })
  async projects(@Context() ctx: any, @Args() args: FindManyProjectArgs): Promise<Project[]> {
    return this.projectService.projects(args);
  }

  @Mutation(_returns => Project, {
    nullable: false,
    description: undefined
  })
  async createProject(@Context() ctx: any, @Args() args: CreateOneProjectArgs): Promise<Project> {
    return this.projectService.createProject(args);
  }

  @Mutation(_returns => Project, {
    nullable: true,
    description: undefined
  })
  async deleteProject(@Context() ctx: any, @Args() args: FindOneArgs): Promise<Project | null> {
    return this.projectService.deleteProject(args);
  }

  @Mutation(_returns => Project, {
    nullable: true,
    description: undefined
  })
  async updateProject(@Context() ctx: any, @Args() args: UpdateOneProjectArgs): Promise<Project | null> {
    return this.projectService.updateProject(args);
  }


}
