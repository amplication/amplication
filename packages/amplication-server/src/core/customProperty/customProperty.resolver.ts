import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { InjectContextValue } from "../../decorators/injectContextValue.decorator";
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
import { CustomPropertyOption } from "../../models/CustomPropertyOption";
import { CreateCustomPropertyOptionArgs } from "./dto/CreateCustomPropertyOptionArgs";
import { UpdateCustomPropertyOptionArgs } from "./dto/UpdateCustomPropertyOptionArgs";
import { DeleteCustomPropertyOptionArgs } from "./dto/DeleteCustomPropertyOptionArgs.ts";

@Resolver(() => CustomProperty)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class CustomPropertyResolver {
  constructor(private customPropertyService: CustomPropertyService) {}

  @Query(() => [CustomProperty], { nullable: false })
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
  @AuthorizeContext(AuthorizableOriginParameter.CustomPropertyId, "where.id")
  async customProperty(
    @Args() args: FindOneArgs
  ): Promise<CustomProperty | null> {
    return this.customPropertyService.customProperty(args);
  }

  @Mutation(() => CustomProperty, { nullable: false })
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "data.workspace.connect.id",
    "property.create"
  )
  async createCustomProperty(
    @Args() args: CustomPropertyCreateArgs,
    @UserEntity() user: User
  ): Promise<CustomProperty> {
    return this.customPropertyService.createCustomProperty(args);
  }

  @Mutation(() => CustomProperty, { nullable: true })
  @AuthorizeContext(
    AuthorizableOriginParameter.CustomPropertyId,
    "where.id",
    "property.delete"
  )
  async deleteCustomProperty(
    @Args() args: FindOneArgs
  ): Promise<CustomProperty | null> {
    return this.customPropertyService.deleteCustomProperty(args);
  }

  @Mutation(() => CustomProperty, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.CustomPropertyId,
    "where.id",
    "property.edit"
  )
  async updateCustomProperty(
    @Args() args: UpdateCustomPropertyArgs
  ): Promise<CustomProperty> {
    return this.customPropertyService.updateCustomProperty(args);
  }

  @Mutation(() => CustomPropertyOption, {
    nullable: false,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.CustomPropertyId,
    "data.customProperty.connect.id",
    "property.edit"
  )
  async createCustomPropertyOption(
    @Args() args: CreateCustomPropertyOptionArgs
  ): Promise<CustomPropertyOption> {
    return this.customPropertyService.createOption(args);
  }

  @Mutation(() => CustomPropertyOption, {
    nullable: false,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.CustomPropertyId,
    "where.customProperty.id",
    "property.edit"
  )
  async updateCustomPropertyOption(
    @Args() args: UpdateCustomPropertyOptionArgs
  ): Promise<CustomPropertyOption> {
    return this.customPropertyService.updateOption(args);
  }

  @Mutation(() => CustomPropertyOption, {
    nullable: false,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.CustomPropertyId,
    "where.customProperty.id",
    "property.edit"
  )
  async deleteCustomPropertyOption(
    @Args() args: DeleteCustomPropertyOptionArgs
  ): Promise<CustomPropertyOption> {
    return this.customPropertyService.deleteOption(args);
  }
}
