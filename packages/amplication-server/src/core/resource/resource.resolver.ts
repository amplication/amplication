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
import { Resource, Entity, User, Project } from "../../models";
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

@Resolver(() => Resource)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ResourceResolver {
  constructor(
    private readonly resourceService: ResourceService,
    private readonly entityService: EntityService,
    private readonly buildService: BuildService,
    private readonly environmentService: EnvironmentService
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
  @AuthorizeContext(AuthorizableOriginParameter.ProjectId, "where.project.id")
  async resources(@Args() args: FindManyResourceArgs): Promise<Resource[]> {
    return this.resourceService.resources(args);
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
    return this.resourceService.project(resource.id);
  }
}
