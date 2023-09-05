import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UseFilters, UseGuards } from "@nestjs/common";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import {
  CreateResourceRoleArgs,
  FindManyResourceRoleArgs,
  UpdateOneResourceRoleArgs,
  FindOneResourceRoleArgs,
  DeleteResourceRoleArgs,
} from "./dto";
import { ResourceRole } from "../../models";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { ResourceRoleService } from "./resourceRole.service";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";

@Resolver(() => ResourceRole)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ResourceRoleResolver {
  constructor(private readonly resourceRoleService: ResourceRoleService) {}
  @Query(() => ResourceRole, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceRoleId, "where.id")
  async resourceRole(
    @Args() args: FindOneResourceRoleArgs
  ): Promise<ResourceRole | null> {
    return this.resourceRoleService.getResourceRole(args);
  }

  @Query(() => [ResourceRole], {
    nullable: false,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.resource.id")
  async resourceRoles(
    @Args() args: FindManyResourceRoleArgs
  ): Promise<ResourceRole[]> {
    return this.resourceRoleService.getResourceRoles(args);
  }

  @Mutation(() => ResourceRole, {
    nullable: false,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.ResourceId,
    "data.resource.connect.id"
  )
  async createResourceRole(
    @Args() args: CreateResourceRoleArgs
  ): Promise<ResourceRole> {
    return this.resourceRoleService.createResourceRole(args);
  }

  @Mutation(() => ResourceRole, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceRoleId, "where.id")
  async deleteResourceRole(
    @Args() args: DeleteResourceRoleArgs
  ): Promise<ResourceRole | null> {
    return this.resourceRoleService.deleteResourceRole(args);
  }

  @Mutation(() => ResourceRole, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceRoleId, "where.id")
  async updateResourceRole(
    @Args() args: UpdateOneResourceRoleArgs
  ): Promise<ResourceRole | null> {
    return this.resourceRoleService.updateResourceRole(args);
  }
}
