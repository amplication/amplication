import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
//import { EntityFieldCreateWithoutEntityVersionInput } from "../inputs/EntityFieldCreateWithoutEntityVersionInput";
import { WhereUniqueInput } from "./WhereUniqueInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class EntityFieldConnectInput {

  @Field(_type => [WhereUniqueInput], {
    nullable: true,
    description: undefined
  })
  connect?: WhereUniqueInput[] | null;
}
