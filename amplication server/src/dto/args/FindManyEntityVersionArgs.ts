import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { EntityVersionOrderByInput } from "../inputs/EntityVersionOrderByInput";
import { EntityVersionWhereInput } from "../inputs/EntityVersionWhereInput";
import { WhereUniqueInput } from "../inputs/WhereUniqueInput";

@ArgsType()
export class FindManyEntityVersionArgs {
  @Field(_type => EntityVersionWhereInput, { nullable: true })
  where?: EntityVersionWhereInput | null;

  @Field(_type => EntityVersionOrderByInput, { nullable: true })
  orderBy?: EntityVersionOrderByInput | null;

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
