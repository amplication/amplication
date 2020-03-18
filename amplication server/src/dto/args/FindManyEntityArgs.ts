import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { EntityOrderByInput } from "../inputs/EntityOrderByInput";
import { EntityWhereInput } from "../inputs/EntityWhereInput";
import { WhereUniqueInput } from "../inputs/WhereUniqueInput";

@ArgsType()
export class FindManyEntityArgs {
  @Field(_type => EntityWhereInput, { nullable: true })
  where?: EntityWhereInput | null;

  @Field(_type => EntityOrderByInput, { nullable: true })
  orderBy?: EntityOrderByInput | null;

  @Field(_type => Int, { nullable: true })
  skip?: number | null;

  @Field(_type => WhereUniqueInput, { nullable: true })
  after?: WhereUniqueInput | null;

  @Field(_type => WhereUniqueInput, { nullable: true })
  before?: WhereUniqueInput | null;

  @Field(_type => Int, { nullable: true })
  first?: number | null;

  @Field(_type => Int, { nullable: true })
  last?: number | null;
}
