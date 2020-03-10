import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { AccountUserWhereInput } from "./AccountUserWhereInput";
import { BooleanFilter } from "./BooleanFilter";
import { DateTimeFilter } from "./DateTimeFilter";
import { EnumRoleLevelFilter } from "./EnumRoleLevelFilter";
import { StringFilter } from "./StringFilter";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class UserRoleWhereInput {
  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  id?: StringFilter | null;

  @Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  createdAt?: DateTimeFilter | null;

  @Field(_type => DateTimeFilter, {
    nullable: true,
    description: undefined
  })
  updatedAt?: DateTimeFilter | null;

  @Field(_type => EnumRoleLevelFilter, {
    nullable: true,
    description: undefined
  })
  roleLevel?: EnumRoleLevelFilter | null;

  @Field(_type => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  createEntity?: BooleanFilter | null;

  @Field(_type => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  createFlow?: BooleanFilter | null;

  @Field(_type => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  createUi?: BooleanFilter | null;

  @Field(_type => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  createWebServices?: BooleanFilter | null;

  @Field(_type => [UserRoleWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: UserRoleWhereInput[] | null;

  @Field(_type => [UserRoleWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: UserRoleWhereInput[] | null;

  @Field(_type => [UserRoleWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: UserRoleWhereInput[] | null;

  @Field(_type => AccountUserWhereInput, {
    nullable: true,
    description: undefined
  })
  accountUser?: AccountUserWhereInput | null;
}
