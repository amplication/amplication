import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { EntityFieldUpdateInput } from "../inputs/EntityFieldUpdateInput";
import { WhereUniqueInput } from "../inputs/WhereUniqueInput";

@ArgsType()
export class UpdateOneEntityFieldArgs {
  @Field(_type => EntityFieldUpdateInput, { nullable: false })
  data!: EntityFieldUpdateInput;

  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
