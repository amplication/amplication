import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { EntityCreateInput } from "../inputs/EntityCreateInput";

@ArgsType()
export class CreateOneEntityArgs {
  @Field(_type => EntityCreateInput, { nullable: false })
  data!: EntityCreateInput;
}
