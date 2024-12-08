import { UseFilters, UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { Roles } from "../../decorators/roles.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { FindOneArgs } from "../../dto";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Resource, Entity, User, Project, Team, Blueprint } from "../../models";
import { GitRepository } from "../../models/GitRepository";
import { ResourceService, EntityService } from "..";
import { BuildService } from "../build/build.service";
import { Build } from "../build/dto/Build";
import { FindManyBuildArgs } from "../build/dto/FindManyBuildArgs";
import { FindManyEntityArgs } from "../entity/dto";
import { Environment } from "../environment/dto/Environment";
import { EnvironmentService } from "../environment/environment.service";
import {
  CreateServiceWithEntitiesArgs,
  CreateOneResourceArgs,
  FindManyResourceArgs,
  UpdateOneResourceArgs,
  ResourceCreateWithEntitiesResult,
  UpdateCodeGeneratorVersionArgs,
} from "./dto";
import { RedesignProjectArgs } from "./dto/RedesignProjectArgs";
import { UserAction } from "../userAction/dto";
import { EnumCodeGenerator } from "./dto/EnumCodeGenerator";
import { CODE_GENERATOR_NAME_TO_ENUM } from "./resource.service";
import { ServiceSettingsService } from "../serviceSettings/serviceSettings.service";
import { ResourceVersion } from "../resourceVersion/dto/ResourceVersion";
import { ResourceVersionService } from "../resourceVersion/resourceVersion.service";
import { Owner } from "../ownership/dto/Owner";
import { OwnershipService } from "../ownership/ownership.service";
import { Ownership } from "../ownership/dto/Ownership";
import { SetResourceOwnerArgs } from "./dto/SetResourceOwnerArgs";
import { ProjectService } from "../project/project.service";
import { InjectContextValue } from "../../decorators/injectContextValue.decorator";
import { InjectableOriginParameter } from "../../enums/InjectableOriginParameter";
import { BlueprintService } from "../blueprint/blueprint.service";
import { Relation } from "../relation/dto/Relation";
import { RelationService } from "../relation/relation.service";
import { PaginatedResourceQueryResult } from "../../dto/PaginatedQueryResult";
import { ResourceSettings } from "../resourceSettings/dto";
import { ResourceSettingsService } from "../resourceSettings/resourceSettings.service";

@Resolver(() => Resource)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ResourceResolver {
  constructor(
    private readonly resourceService: ResourceService,
    private readonly entityService: EntityService,
    private readonly buildService: BuildService,
    private readonly environmentService: EnvironmentService,
    private readonly serviceSettingsService: ServiceSettingsService,
    private readonly resourceVersionService: ResourceVersionService,
    private readonly ownershipService: OwnershipService,
    private readonly projectService: ProjectService,
    private readonly blueprintService: BlueprintService,
    private readonly relationService: RelationService,
    private readonly resourceSettingsService: ResourceSettingsService
  ) {}

  @Query(() => Resource, { nullable: true })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.id")
  async resource(@Args() args: FindOneArgs): Promise<Resource | null> {
    return this.resourceService.resource(args);
  }

  @Query(() => [Resource], {
    nullable: false,
  })
  @Roles("ORGANIZATION_ADMIN")
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "where.project.workspace.id"
  )
  async resources(@Args() args: FindManyResourceArgs): Promise<Resource[]> {
    return this.resourceService.resources(args);
  }

  @Query(() => PaginatedResourceQueryResult, {
    nullable: false,
  })
  @Roles("ORGANIZATION_ADMIN")
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "where.project.workspace.id"
  )
  async catalog(
    @Args() args: FindManyResourceArgs
  ): Promise<PaginatedResourceQueryResult> {
    return this.resourceService.searchResourcesWithCount(args);
  }

  @Query(() => [Resource], {
    nullable: false,
  })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.id")
  async messageBrokerConnectedServices(
    @Args() args: FindOneArgs
  ): Promise<Resource[]> {
    return this.resourceService.messageBrokerConnectedServices(args);
  }

  @ResolveField(() => [Entity])
  async entities(
    @Parent() resource: Resource,
    @Args() args: FindManyEntityArgs
  ): Promise<Entity[]> {
    return this.entityService.entities({
      ...args,
      where: { ...args.where, resource: { id: resource.id } },
    });
  }

  @ResolveField(() => [Build])
  async builds(
    @Parent() resource: Resource,
    @Args() args: FindManyBuildArgs
  ): Promise<Build[]> {
    return this.buildService.findMany({
      ...args,
      where: { ...args.where, resource: { id: resource.id } },
    });
  }

  @ResolveField(() => [Environment])
  async environments(@Parent() resource: Resource): Promise<Environment[]> {
    return this.environmentService.findMany({
      where: { resource: { id: resource.id } },
    });
  }

  @Mutation(() => Resource, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(
    AuthorizableOriginParameter.ProjectId,
    "data.project.connect.id"
  )
  async createMessageBroker(
    @Args() args: CreateOneResourceArgs,
    @UserEntity() user: User
  ): Promise<Resource> {
    return this.resourceService.createMessageBroker(args, user);
  }

  @Mutation(() => Resource, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(
    AuthorizableOriginParameter.ProjectId,
    "data.project.connect.id"
  )
  async createPluginRepository(
    @Args() args: CreateOneResourceArgs,
    @UserEntity() user: User
  ): Promise<Resource> {
    return this.resourceService.createPluginRepository(args, user);
  }

  @Mutation(() => Resource, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(
    AuthorizableOriginParameter.ProjectId,
    "data.project.connect.id"
  )
  async createComponent(
    @Args() args: CreateOneResourceArgs,
    @UserEntity() user: User
  ): Promise<Resource> {
    return this.resourceService.createComponent(args, user);
  }

  @Mutation(() => Resource, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(
    AuthorizableOriginParameter.ProjectId,
    "data.project.connect.id"
  )
  async createService(
    @Args() args: CreateOneResourceArgs,
    @UserEntity() user: User
  ): Promise<Resource> {
    return this.resourceService.createService(args, user);
  }

  @Mutation(() => ResourceCreateWithEntitiesResult, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(
    AuthorizableOriginParameter.ProjectId,
    "data.resource.project.connect.id"
  )
  async createServiceWithEntities(
    @Args() args: CreateServiceWithEntitiesArgs,
    @UserEntity() user: User
  ): Promise<ResourceCreateWithEntitiesResult> {
    return this.resourceService.createServiceWithEntities(args.data, user);
  }

  @Mutation(() => Resource, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.id")
  async deleteResource(
    @Args() args: FindOneArgs,
    @UserEntity() user: User
  ): Promise<Resource | null> {
    return this.resourceService.deleteResource(args, user);
  }

  @Mutation(() => Resource, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.id")
  async updateResource(
    @Args() args: UpdateOneResourceArgs
  ): Promise<Resource | null> {
    return this.resourceService.updateResource(args);
  }

  @Mutation(() => Resource, { nullable: false })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "data.resourceId")
  async setResourceOwner(
    @Args() args: SetResourceOwnerArgs,
    @UserEntity() user: User
  ): Promise<Resource> {
    await this.resourceService.setOwner(
      args.data.resourceId,
      args.data.userId,
      args.data.teamId
    );

    return this.resourceService.resource({
      where: {
        id: args.data.resourceId,
      },
    });
  }

  @Mutation(() => UserAction, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.ProjectId, "data.projectId")
  async redesignProject(
    @Args() args: RedesignProjectArgs,
    @UserEntity() user: User
  ): Promise<UserAction> {
    return this.resourceService.redesignProject(args, user);
  }

  @Mutation(() => Resource, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.id")
  async updateCodeGeneratorVersion(
    @Args() args: UpdateCodeGeneratorVersionArgs,
    @UserEntity() user: User
  ): Promise<Resource | null> {
    return this.resourceService.updateCodeGeneratorVersion(args, user);
  }

  @ResolveField(() => GitRepository, { nullable: true })
  async gitRepository(
    @Parent() resource: Resource
  ): Promise<GitRepository | null> {
    return await this.resourceService.gitRepository(resource.id);
  }

  @ResolveField(() => Project)
  async project(@Parent() resource: Resource): Promise<Project> {
    return this.projectService.findUnique({
      where: { id: resource.projectId },
    });
  }

  @ResolveField(() => EnumCodeGenerator, { nullable: true })
  async codeGenerator(
    @Parent() resource: Resource
  ): Promise<EnumCodeGenerator> {
    const codeGenerator =
      CODE_GENERATOR_NAME_TO_ENUM[resource.codeGeneratorName];

    if (!codeGenerator) {
      return EnumCodeGenerator.NodeJs;
    }

    return codeGenerator;
  }

  @ResolveField(() => Resource, { nullable: true })
  async serviceTemplate(
    @Parent() resource: Resource,
    @UserEntity() user: User
  ): Promise<Resource> {
    const serviceTemplateVersion =
      await this.resourceService.getServiceTemplateSettings(resource.id, user);

    if (!serviceTemplateVersion) {
      return null;
    }

    return this.resourceService.resource({
      where: {
        id: serviceTemplateVersion.serviceTemplateId,
      },
    });
  }

  @ResolveField(() => Blueprint, { nullable: true })
  async blueprint(@Parent() resource: Resource): Promise<Blueprint> {
    if (!resource.blueprintId) {
      return null;
    }

    return this.blueprintService.blueprint({
      where: {
        id: resource.blueprintId,
      },
    });
  }

  @ResolveField(() => String, { nullable: true })
  async serviceTemplateVersion(
    @Parent() resource: Resource,
    @UserEntity() user: User
  ): Promise<string> {
    const serviceTemplateVersion =
      await this.resourceService.getServiceTemplateSettings(resource.id, user);

    return serviceTemplateVersion ? serviceTemplateVersion.version : null;
  }

  @ResolveField(() => ResourceVersion, { nullable: true })
  async version(
    @Parent() resource: Resource,
    @UserEntity() user: User
  ): Promise<ResourceVersion | null> {
    if (!resource.id) {
      return null;
    }

    return this.resourceVersionService.getLatest(resource.id);
  }

  @ResolveField(() => Owner, { nullable: true })
  async owner(@Parent() resource: Resource): Promise<User | Team> {
    if (!resource.id) {
      return null;
    }

    if (!resource.ownershipId) {
      return null;
    }

    return (await this.ownershipService.getOwnership(resource.ownershipId))
      .owner;
  }

  @ResolveField(() => [Relation], { nullable: true })
  async relations(@Parent() resource: Resource): Promise<Relation[]> {
    if (!resource.id) {
      return null;
    }

    return this.relationService.findMany({
      where: {
        resource: {
          id: resource.id,
        },
      },
    });
  }

  @ResolveField(() => ResourceSettings, { nullable: true })
  async settings(
    @Parent() resource: Resource
  ): Promise<ResourceSettings | null> {
    if (!resource.id) {
      return null;
    }

    return await this.resourceSettingsService.getResourceSettingsBlock({
      where: {
        id: resource.id,
      },
    });
  }
}
