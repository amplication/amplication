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
import { EnumResourceType } from "../resource/dto/EnumResourceType";

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
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "where.workspace.id"
  )
  async projects(@Args() args: ProjectFindManyArgs): Promise<Project[]> {
    return this.projectService.findProjects(args);
  }

  @Query(() => Project, { nullable: true })
  @AuthorizeContext(AuthorizableOriginParameter.ProjectId, "where.id")
  async project(@Args() args: FindOneArgs): Promise<Project | null> {
    return this.projectService.findUnique(args);
  }

  @Mutation(() => Project, { nullable: false })
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "data.workspace.connect.id",
    "project.create"
  )
  async createProject(
    @Args() args: ProjectCreateArgs,
    @UserEntity() user: User
  ): Promise<Project> {
    return this.projectService.createProject(args, user.id);
  }

  @Mutation(() => Project, { nullable: true })
  @AuthorizeContext(
    AuthorizableOriginParameter.ProjectId,
    "where.id",
    "project.delete"
  )
  async deleteProject(@Args() args: FindOneArgs): Promise<Project | null> {
    return this.projectService.deleteProject(args);
  }

  @Mutation(() => Project, { nullable: false })
  @AuthorizeContext(AuthorizableOriginParameter.ProjectId, "where.id")
  async updateProject(@Args() args: UpdateProjectArgs): Promise<Project> {
    return this.projectService.updateProject(args);
  }

  @ResolveField(() => String)
  async description(@Parent() project: Project): Promise<string> {
    const [configuration] = await this.resourceService.resources({
      where: {
        project: { id: project.id },
        resourceType: { equals: EnumResourceType.ProjectConfiguration },
      },
    });
    return configuration?.description;
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
