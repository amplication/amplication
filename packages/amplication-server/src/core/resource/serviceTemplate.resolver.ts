import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { FindOneArgs } from "../../dto";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Resource, User } from "../../models";
import { FindManyResourceArgs } from "./dto";
import { CreateResourceFromTemplateArgs } from "./dto/CreateResourceFromTemplateArgs";
import { CreateServiceTemplateArgs } from "./dto/CreateServiceTemplateArgs";
import { CreateTemplateFromResourceArgs } from "./dto/CreateTemplateFromResourceArgs";
import { FindAvailableTemplatesForProjectArgs } from "./dto/FindAvailableTemplatesForProjectArgs";
import { ServiceTemplateService } from "./serviceTemplate.service";

@Resolver(() => Resource)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ServiceTemplateResolver {
  constructor(private readonly service: ServiceTemplateService) {}

  @Mutation(() => Resource, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.ProjectId,
    "data.resource.project.connect.id",
    "resource.createTemplate"
  )
  async createServiceTemplate(
    @Args() args: CreateServiceTemplateArgs,
    @UserEntity() user: User
  ): Promise<Resource> {
    return this.service.createServiceTemplate(args, user);
  }

  @Query(() => [Resource], {
    nullable: false,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ProjectId, "where.project.id")
  async serviceTemplates(
    @Args() args: FindManyResourceArgs
  ): Promise<Resource[]> {
    return this.service.serviceTemplates(args);
  }

  @Query(() => [Resource], {
    nullable: false,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ProjectId, "where.id")
  async availableTemplatesForProject(
    @Args() args: FindAvailableTemplatesForProjectArgs,
    @UserEntity() user: User
  ): Promise<Resource[]> {
    return this.service.availableServiceTemplatesForProject(args, user);
  }

  @Mutation(() => Resource, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.ProjectId,
    "data.project.connect.id",
    "resource.createFromTemplate"
  )
  async createResourceFromTemplate(
    @Args() args: CreateResourceFromTemplateArgs,
    @UserEntity() user: User
  ): Promise<Resource> {
    return this.service.createResourceFromTemplate(args, user);
  }

  @Mutation(() => Resource, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.ResourceId,
    "data.resource.id",
    "resource.createTemplate"
  )
  async createTemplateFromExistingResource(
    @Args() args: CreateTemplateFromResourceArgs,
    @UserEntity() user: User
  ): Promise<Resource> {
    return this.service.createTemplateFromExistingResource(args, user);
  }

  @Mutation(() => Resource, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.ResourceId,
    "where.id",
    "resource.*.edit"
  )
  async upgradeServiceToLatestTemplateVersion(
    @Args() args: FindOneArgs,
    @UserEntity() user: User
  ): Promise<Resource> {
    return this.service.upgradeServiceToLatestTemplateVersion(args, user);
  }
}
