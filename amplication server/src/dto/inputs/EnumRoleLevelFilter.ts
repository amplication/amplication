import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { EnumRoleLevel } from "../../enums/EnumRoleLevel";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class EnumRoleLevelFilter {
  @Field(_type => EnumRoleLevel, {
    nullable: true,
    description: undefined
  })
  equals?: keyof typeof EnumRoleLevel | null;

  @Field(_type => EnumRoleLevel, {
    nullable: true,
    description: undefined
  })
  not?: keyof typeof EnumRoleLevel | null;

  @Field(_type => [EnumRoleLevel], {
    nullable: true,
    description: undefined
  })
  in?: keyof typeof EnumRoleLevel[] | null;

  @Field(_type => [EnumRoleLevel], {
    nullable: true,
    description: undefined
  })
  notIn?: keyof typeof EnumRoleLevel[] | null;
}
