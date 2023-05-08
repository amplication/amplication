import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { FindOneArgs } from "../../dto";
import { Commit, Project, Resource, User } from "../../models";
import { ProjectCreateArgs } from "./dto/ProjectCreateArgs";
import { UpdateProjectArgs } from "./dto/UpdateProjectArgs";
import { ProjectFindManyArgs } from "./dto/ProjectFindManyArgs";
import { ProjectService } from "./project.service";
import { InjectContextValue } from "../../decorators/injectContextValue.decorator";
import { InjectableOriginParameter } from "../../enums/InjectableOriginParameter";
import { Roles } from "../../decorators/roles.decorator";
import { Inject, UseFilters, UseGuards } from "@nestjs/common";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { UserEntity } from "../../decorators/user.decorator";
import { ResourceService } from "../resource/resource.service";
import {
  CreateCommitArgs,
  DiscardPendingChangesArgs,
  FindPendingChangesArgs,
  PendingChange,
} from "../resource/dto";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Resolver(() => Project)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ProjectResolver {
  constructor(
    private projectService: ProjectService,
    private resourceService: ResourceService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  @Query(() => [Project], { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "where.workspace.id"
  )
  async projects(@Args() args: ProjectFindManyArgs): Promise<Project[]> {
    return this.projectService.findProjects(args);
  }

  @Query(() => Project, { nullable: true })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.ProjectId, "where.id")
  async project(@Args() args: FindOneArgs): Promise<Project | null> {
    return this.projectService.findUnique(args);
  }

  @Mutation(() => Project, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "data.workspace.connect.id"
  )
  async createProject(
    @Args() args: ProjectCreateArgs,
    @UserEntity() user: User
  ): Promise<Project> {
    return this.projectService.createProject(args, user.id);
  }

  @Mutation(() => Project, { nullable: true })
  @Roles("ORGANIZATION_ADMIN")
  async deleteProject(@Args() args: FindOneArgs): Promise<Project | null> {
    return this.projectService.deleteProject(args);
  }

  @Mutation(() => Project, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  async updateProject(@Args() args: UpdateProjectArgs): Promise<Project> {
    return this.projectService.updateProject(args);
  }

  @ResolveField(() => [Resource])
  async resources(@Parent() project: Project): Promise<Resource[]> {
    return this.resourceService.resources({
      where: { project: { id: project.id } },
    });
  }

  /** pending changes and commit */

  @Mutation(() => Commit, {
    nullable: true,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.ProjectId,
    "data.project.connect.id"
  )
  @InjectContextValue(InjectableOriginParameter.UserId, "data.user.connect.id")
  async commit(
    @UserEntity() currentUser: User,
    @Args() args: CreateCommitArgs
  ): Promise<Commit | null> {
    try {
      return await this.projectService.commit(args, currentUser);
    } catch (error) {
      this.logger.error(error.message, error);
      throw error;
    }
  }

  @Mutation(() => Boolean, {
    nullable: true,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.ProjectId,
    "data.project.connect.id"
  )
  @InjectContextValue(InjectableOriginParameter.UserId, "data.user.connect.id")
  async discardPendingChanges(
    @Args() args: DiscardPendingChangesArgs
  ): Promise<boolean | null> {
    return this.projectService.discardPendingChanges(args);
  }

  @Query(() => [PendingChange], {
    nullable: false,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ProjectId, "where.project.id")
  async pendingChanges(
    @Args() args: FindPendingChangesArgs,
    @UserEntity() user: User
  ): Promise<PendingChange[]> {
    return this.projectService.getPendingChanges(args, user);
  }
}
