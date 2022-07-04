import { Args, Query, Resolver } from '@nestjs/graphql';
import { FindOneArgs } from 'src/dto';
import { Project } from 'src/models';
import { ProjectService } from './project.service';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  @Query(() => Project, { nullable: true })
  async project(@Args() args: FindOneArgs): Promise<Project> {
    return this.projectService.findProject(args);
  }
}
