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
import { InjectContextValue } from "../../decorators/injectContextValue.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { FindOneArgs } from "../../dto";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { InjectableOriginParameter } from "../../enums/InjectableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Blueprint, CustomProperty, User } from "../../models";
import { BlueprintService } from "./blueprint.service";
import { BlueprintCreateArgs } from "./dto/BlueprintCreateArgs";
import { BlueprintFindManyArgs } from "./dto/BlueprintFindManyArgs";
import { UpdateBlueprintArgs } from "./dto/UpdateBlueprintArgs";
import { BlueprintRelation } from "../../models/BlueprintRelation";
import { UpsertBlueprintRelationArgs } from "./dto/UpsertBlueprintRelationArgs";
import { DeleteBlueprintRelationArgs } from "./dto/DeleteBlueprintRelationArgs";

@Resolver(() => Blueprint)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class BlueprintResolver {
  constructor(private blueprintService: BlueprintService) {}

  @Query(() => [Blueprint], { nullable: false })
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "where.workspace.id"
  )
  async blueprints(@Args() args: BlueprintFindManyArgs): Promise<Blueprint[]> {
    return this.blueprintService.blueprints(args);
  }

  @Query(() => Blueprint, { nullable: true })
  @AuthorizeContext(AuthorizableOriginParameter.BlueprintId, "where.id")
  async blueprint(@Args() args: FindOneArgs): Promise<Blueprint | null> {
    return this.blueprintService.blueprint(args);
  }

  @Mutation(() => Blueprint, { nullable: false })
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "data.workspace.connect.id",
    "blueprint.create"
  )
  async createBlueprint(
    @Args() args: BlueprintCreateArgs,
    @UserEntity() user: User
  ): Promise<Blueprint> {
    return this.blueprintService.createBlueprint(args);
  }

  @Mutation(() => Blueprint, { nullable: true })
  @AuthorizeContext(
    AuthorizableOriginParameter.BlueprintId,
    "where.id",
    "blueprint.delete"
  )
  async deleteBlueprint(@Args() args: FindOneArgs): Promise<Blueprint | null> {
    return this.blueprintService.deleteBlueprint(args);
  }

  @Mutation(() => Blueprint, { nullable: false })
  @AuthorizeContext(
    AuthorizableOriginParameter.BlueprintId,
    "where.id",
    "blueprint.edit"
  )
  async updateBlueprint(@Args() args: UpdateBlueprintArgs): Promise<Blueprint> {
    return this.blueprintService.updateBlueprint(args);
  }

  @Mutation(() => BlueprintRelation, {
    nullable: false,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.BlueprintId,
    "where.blueprint.id",
    "blueprint.edit"
  )
  async upsertBlueprintRelation(
    @Args() args: UpsertBlueprintRelationArgs
  ): Promise<BlueprintRelation> {
    return this.blueprintService.upsertRelation(args);
  }

  @Mutation(() => BlueprintRelation, {
    nullable: false,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.BlueprintId,
    "where.blueprint.id",
    "blueprint.edit"
  )
  async deleteBlueprintRelation(
    @Args() args: DeleteBlueprintRelationArgs
  ): Promise<BlueprintRelation> {
    return this.blueprintService.deleteRelation(args);
  }

  @ResolveField(() => [CustomProperty])
  async properties(@Parent() blueprint: Blueprint): Promise<CustomProperty[]> {
    return this.blueprintService.properties({
      where: {
        id: blueprint.id,
      },
    });
  }
}
