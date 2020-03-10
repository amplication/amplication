import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { Account } from "./Account";
import { Organization } from "./Organization";
import { UserRole } from "./UserRole";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class AccountUser {
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

  account?: Account;

  organization?: Organization;

  userRoles?: UserRole[] | null;
}
