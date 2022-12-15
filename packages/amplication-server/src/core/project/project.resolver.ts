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
import { forwardRef, Inject, UseFilters, UseGuards } from "@nestjs/common";
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
import { WorkspaceService } from "../workspace/workspace.service";
import { SubscriptionService } from "../subscription/subscription.service";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { EntityService } from "../entity/entity.service";

@Resolver(() => Project)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ProjectResolver {
  constructor(
    private projectService: ProjectService,
    @Inject(forwardRef(() => EntityService))
    private readonly entityService: EntityService,
    @Inject(forwardRef(() => ResourceService))
    private resourceService: ResourceService,
    @Inject(forwardRef(() => WorkspaceService))
    private readonly workspaceService: WorkspaceService,
    @Inject(forwardRef(() => SubscriptionService))
    private readonly subscriptionService: SubscriptionService
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
  async commit(@Args() args: CreateCommitArgs): Promise<Commit | null> {
    const projectId = args.data.project.connect.id;

    await this.validateProject(projectId);

    return this.projectService.commit(args);
  }

  async validateProject(projectId: string): Promise<void> {
    const project = await this.projectService.findUnique({
      where: { id: projectId },
    });
    const workspace = await this.workspaceService.getWorkspace({
      where: { id: project.workspaceId },
    });
    const subscription = await this.subscriptionService.getCurrentSubscription(
      workspace.id
    );

    if (!subscription) {
      const services = await this.resourceService.getWorkspaceServices(
        workspace.id
      );

      if (services.length > 3) {
        throw new Error(
          "You have reached the maximum number of services. (Upgrade your workspace plan)"
        );
      }

      const projectServices = await this.resourceService.resources({
        where: { projectId: project.id },
      });
      const promises = projectServices.map((project) =>
        this.validateService(project)
      );

      await Promise.all(promises);
    }
  }

  async validateService(service: Resource): Promise<void> {
    const entities = await this.entityService.entities({
      where: { resourceId: service.id },
    });

    if (entities.length > 7) {
      throw new Error(
        "You have reached the maximum number of entities. (Upgrade your workspace plan)"
      );
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
