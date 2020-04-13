import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { EntityVersionCreateInput } from "../inputs/EntityVersionCreateInput";

@ArgsType()
export class CreateOneEntityVersionArgs {
  @Field(_type => EntityVersionCreateInput, { nullable: false })
  data!: EntityVersionCreateInput;
}
