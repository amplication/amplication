import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ResourceSettingsService } from "./resourceSettings.service";
import { ResourceSettings, UpdateResourceSettingsArgs } from "./dto";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { FindOneArgs } from "../../dto";
import { UserEntity } from "../../decorators/user.decorator";
import { User } from "../../models";
import { UseFilters, UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";

@Resolver(() => ResourceSettings)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ResourceSettingsResolver {
  constructor(private readonly service: ResourceSettingsService) {}

  @Mutation(() => ResourceSettings, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.id")
  async updateResourceSettings(
    @Args() args: UpdateResourceSettingsArgs,
    @UserEntity() user: User
  ): Promise<ResourceSettings> {
    return this.service.updateResourceSettings(args, user);
  }

  @Query(() => ResourceSettings, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.id")
  async resourceSettings(
    @Args() args: FindOneArgs
  ): Promise<ResourceSettings | null> {
    return this.service.getResourceSettingsBlock(args);
  }
}
