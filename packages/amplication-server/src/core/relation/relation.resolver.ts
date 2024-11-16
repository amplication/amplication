import { Resolver } from "@nestjs/graphql";
import { RelationService } from "./relation.service";
import { FindManyRelationArgs } from "./dto/FindManyRelationArgs";
import { BlockTypeResolver } from "../block/blockType.resolver";
import { Relation } from "./dto/Relation";
import { CreateRelationArgs } from "./dto/CreateRelationArgs";
import { UpdateRelationArgs } from "./dto/UpdateRelationArgs";
import { DeleteRelationArgs } from "./dto/DeleteRelationArgs";
import { UseFilters, UseGuards } from "@nestjs/common";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";

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
}
