import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ServiceSettingsService } from "./serviceSettings.service";
import { ServiceSettings, UpdateServiceSettingsArgs } from "./dto";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { FindOneArgs } from "../../dto";
import { UserEntity } from "../../decorators/user.decorator";
import { User } from "../../models";
import { UseFilters, UseGuards } from "@nestjs/common";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";

@Resolver(() => ServiceSettings)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ServiceSettingsResolver {
  constructor(private readonly service: ServiceSettingsService) {}

  @Mutation(() => ServiceSettings, {
    nullable: true,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.id")
  async updateServiceSettings(
    @Args() args: UpdateServiceSettingsArgs,
    @UserEntity() user: User
  ): Promise<ServiceSettings> {
    return this.service.updateServiceSettings(args, user);
  }

  @Query(() => ServiceSettings, {
    nullable: false,
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "where.id")
  async serviceSettings(
    @Args() args: FindOneArgs,
    @UserEntity() user: User
  ): Promise<ServiceSettings> {
    return this.service.getServiceSettingsBlock(args, user);
  }
}
