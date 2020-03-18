import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { EntityFieldCreateInput,WhereParentIdInput } from "../inputs";

@ArgsType()
export class CreateOneEntityFieldArgs {
  @Field(_type => EntityFieldCreateInput, { nullable: false })
  data!: EntityFieldCreateInput;
  // @Field(_type => WhereParentIdInput, { nullable: false })
  // where :WhereParentIdInput;
}
