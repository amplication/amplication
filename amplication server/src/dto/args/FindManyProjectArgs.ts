import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { ProjectOrderByInput } from '../inputs/ProjectOrderByInput';
import { ProjectWhereInput } from "../inputs/ProjectWhereInput";
import { WhereUniqueInput } from "../inputs";

@ArgsType()
export class FindManyProjectArgs {
  @Field(_type => ProjectWhereInput, { nullable: true })
  where?: ProjectWhereInput | null;

  @Field(_type => ProjectOrderByInput, { nullable: true })
  orderBy?: ProjectOrderByInput | null;

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
