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
import { Blueprint, User } from "../../models";
import { BlueprintService } from "./blueprint.service";
import { BlueprintCreateArgs } from "./dto/BlueprintCreateArgs";
import { BlueprintFindManyArgs } from "./dto/BlueprintFindManyArgs";
import { UpdateBlueprintArgs } from "./dto/UpdateBlueprintArgs";
import { BluePrintRelation } from "../../models/BluePrintRelation";
import { UpsertBlueprintRelationArgs } from "./dto/UpsertBlueprintRelationArgs";

@Resolver(() => Blueprint)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class BlueprintResolver {
  constructor(private blueprintService: BlueprintService) {}

  @Query(() => [Blueprint], { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "where.workspace.id"
  )
  async blueprints(@Args() args: BlueprintFindManyArgs): Promise<Blueprint[]> {
    return this.blueprintService.blueprints(args);
  }

  @Query(() => Blueprint, { nullable: true })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.BlueprintId, "where.id")
  async blueprint(@Args() args: FindOneArgs): Promise<Blueprint | null> {
    return this.blueprintService.blueprint(args);
  }

  @Mutation(() => Blueprint, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "data.workspace.connect.id"
  )
  async createBlueprint(
    @Args() args: BlueprintCreateArgs,
    @UserEntity() user: User
  ): Promise<Blueprint> {
    return this.blueprintService.createBlueprint(args);
  }

  @Mutation(() => Blueprint, { nullable: true })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.BlueprintId, "where.id")
  async deleteBlueprint(@Args() args: FindOneArgs): Promise<Blueprint | null> {
    return this.blueprintService.deleteBlueprint(args);
  }

  @Mutation(() => Blueprint, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.BlueprintId, "where.id")
  async updateBlueprint(@Args() args: UpdateBlueprintArgs): Promise<Blueprint> {
    return this.blueprintService.updateBlueprint(args);
  }

  @Mutation(() => BluePrintRelation, {
    nullable: false,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.BlueprintId,
    "where.blueprint.id"
  )
  async upsertBlueprintRelation(
    @Args() args: UpsertBlueprintRelationArgs
  ): Promise<BluePrintRelation> {
    return this.blueprintService.upsertRelation(args);
  }
}
