import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { InjectContextValue } from "../../decorators/injectContextValue.decorator";
import { Roles } from "../../decorators/roles.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { FindOneArgs } from "../../dto";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { InjectableOriginParameter } from "../../enums/InjectableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { CustomProperty, User } from "../../models";
import { CustomPropertyService } from "./customProperty.service";
import { CustomPropertyCreateArgs } from "./dto/CustomPropertyCreateArgs";
import { CustomPropertyFindManyArgs } from "./dto/CustomPropertyFindManyArgs";
import { UpdateCustomPropertyArgs } from "./dto/UpdateCustomPropertyArgs";

@Resolver(() => CustomProperty)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class CustomPropertyResolver {
  constructor(private customPropertyService: CustomPropertyService) {}

  @Query(() => [CustomProperty], { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "where.workspace.id"
  )
  async customProperties(
    @Args() args: CustomPropertyFindManyArgs
  ): Promise<CustomProperty[]> {
    return this.customPropertyService.customProperties(args);
  }

  @Query(() => CustomProperty, { nullable: true })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.CustomPropertyId, "where.id")
  async customProperty(
    @Args() args: FindOneArgs
  ): Promise<CustomProperty | null> {
    return this.customPropertyService.customProperty(args);
  }

  @Mutation(() => CustomProperty, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "data.workspace.connect.id"
  )
  async createCustomProperty(
    @Args() args: CustomPropertyCreateArgs,
    @UserEntity() user: User
  ): Promise<CustomProperty> {
    return this.customPropertyService.createCustomProperty(args);
  }

  @Mutation(() => CustomProperty, { nullable: true })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.CustomPropertyId, "where.id")
  async deleteCustomProperty(
    @Args() args: FindOneArgs
  ): Promise<CustomProperty | null> {
    return this.customPropertyService.deleteCustomProperty(args);
  }

  @Mutation(() => CustomProperty, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.CustomPropertyId, "where.id")
  async updateCustomProperty(
    @Args() args: UpdateCustomPropertyArgs
  ): Promise<CustomProperty> {
    return this.customPropertyService.updateCustomProperty(args);
  }
}
