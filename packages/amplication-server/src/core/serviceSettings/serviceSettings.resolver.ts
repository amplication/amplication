import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { FindOneArgs } from "../../dto";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { User } from "../../models";
import { ServiceSettings, UpdateServiceSettingsArgs } from "./dto";
import { ServiceSettingsService } from "./serviceSettings.service";
import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

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
