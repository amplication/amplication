import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { Roles } from "../../decorators/roles.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Resource, User } from "../../models";
import { ServiceTemplateService } from "./serviceTemplate.service";
import { CreateServiceTemplateArgs } from "./dto/CreateServiceTemplateArgs";
import { FindManyResourceArgs } from "./dto";

@Resolver(() => Resource)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ServiceTemplateResolver {
  constructor(private readonly service: ServiceTemplateService) {}

  @Mutation(() => Resource, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(
    AuthorizableOriginParameter.ProjectId,
    "data.resource.project.connect.id"
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
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.ProjectId, "where.project.id")
  async serviceTemplates(
    @Args() args: FindManyResourceArgs
  ): Promise<Resource[]> {
    return this.service.serviceTemplates(args);
  }
}
