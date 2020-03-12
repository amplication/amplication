import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { WhereUniqueInput } from "../inputs/WhereUniqueInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class WhereParentIdInput {
  
  @Field(_type => WhereUniqueInput, {
    nullable: false,
    description: undefined
  })
  connect: WhereUniqueInput;
}
