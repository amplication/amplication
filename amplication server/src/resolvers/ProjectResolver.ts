import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { CreateOneProjectArgs,FindManyProjectArgs,FindOneArgs,UpdateOneProjectArgs } from '../dto/args';
import { Project } from '../models';
import { ProjectService} from '../core';
import { GqlAuthGuard } from '../guards/gql-auth.guard'
import { Roles } from '../decorators/roles.decorator';
import { ResourceBasedAuth } from '../decorators/resourceBasedAuth.decorator';
import { ResourceBasedAuthParamType } from '../decorators/resourceBasedAuthParams.dto';

import { UseGuards,Inject,UseFilters} from '@nestjs/common';
import { GqlResolverExceptionsFilter } from '../filters/GqlResolverExceptions.filter'



@Resolver(_of => Project)
@UseGuards(GqlAuthGuard)
@UseFilters(GqlResolverExceptionsFilter)
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService) {}

  @Query(_returns => Project, {
    nullable: true,
    description: undefined
  })
  @Roles("ORGANIZATION_ADMIN")
  @ResourceBasedAuth("where.id", ResourceBasedAuthParamType.ProjectId)
  async project(@Args() args: FindOneArgs): Promise<Project | null> {
    return this.projectService.project(args);
  }

  @Query(_returns => [Project], {
    nullable: false,
    description: undefined
  })
  @Roles("ORGANIZATION_ADMIN")
  @ResourceBasedAuth( "where.organization.id", ResourceBasedAuthParamType.OrganizationId , true)
  async projects(
    @Args() args: FindManyProjectArgs
    ): Promise<Project[]> {
      return this.projectService.projects(args);
  }


  // args.data.organization = {
  //   connect: {
  //     id :'FA90A838-EBFE-4162-9746-22CC9FE49B62'
  //   }
  // }

  @Mutation(_returns => Project, {
    nullable: false,
    description: undefined
  })
  @Roles("ORGANIZATION_ADMIN")
  @ResourceBasedAuth("data.organization.connect.id", ResourceBasedAuthParamType.OrganizationId, true)
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
