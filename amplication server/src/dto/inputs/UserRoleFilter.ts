import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { UserRoleWhereInput } from "./UserRoleWhereInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class UserRoleFilter {
  @Field(_type => UserRoleWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: UserRoleWhereInput | null;

  @Field(_type => UserRoleWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: UserRoleWhereInput | null;

  @Field(_type => UserRoleWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: UserRoleWhereInput | null;
}
