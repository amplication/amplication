import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { AccountUserWhereInput } from "./AccountUserWhereInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class AccountUserFilter {
  @Field(_type => AccountUserWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: AccountUserWhereInput | null;

  @Field(_type => AccountUserWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: AccountUserWhereInput | null;

  @Field(_type => AccountUserWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: AccountUserWhereInput | null;
}
