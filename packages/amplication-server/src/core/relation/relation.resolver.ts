import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { User } from "../../models";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { CreateRelationArgs } from "./dto/CreateRelationArgs";
import { DeleteRelationArgs } from "./dto/DeleteRelationArgs";
import { FindManyRelationArgs } from "./dto/FindManyRelationArgs";
import { Relation } from "./dto/Relation";
import { UpdateRelationArgs } from "./dto/UpdateRelationArgs";
import { UpdateResourceRelationArgs } from "./dto/UpdateResourceRelationArgs";
import { RelationService } from "./relation.service";

@Resolver(() => Relation)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class RelationResolver extends BlockTypeResolver(
  Relation,
  "relations",
  FindManyRelationArgs,
  "createRelation",
  CreateRelationArgs,
  "updateRelation",
  UpdateRelationArgs,
  "deleteRelation",
  DeleteRelationArgs
) {
  constructor(private readonly service: RelationService) {
    super();
  }

  @Mutation(() => Relation, {
    nullable: false,
  })
  @AuthorizeContext(
    AuthorizableOriginParameter.ResourceId,
    "resource.id",
    "resource.*.edit"
  )
  async updateResourceRelation(
    @Args() args: UpdateResourceRelationArgs,
    @UserEntity() user: User
  ): Promise<Relation> {
    return this.service.updateResourceRelation(args, user);
  }
}
