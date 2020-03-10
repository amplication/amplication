import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { AccountUser } from "./AccountUser";
import { EnumRoleLevel } from '../enums/EnumRoleLevel';

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class UserRole {
  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  id!: string;

  @Field(_type => Date, {
    nullable: false,
    description: undefined,
  })
  createdAt!: Date;

  @Field(_type => Date, {
    nullable: false,
    description: undefined,
  })
  updatedAt!: Date;

  accountUser?: AccountUser;

  @Field(_type => EnumRoleLevel, {
    nullable: false,
    description: undefined,
  })
  roleLevel!: keyof typeof EnumRoleLevel;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined,
  })
  createEntity!: boolean;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined,
  })
  createFlow!: boolean;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined,
  })
  createUi!: boolean;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined,
  })
  createWebServices!: boolean;
}
