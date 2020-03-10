import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
//import { AccountUserCreateManyWithoutOrganizationInput } from "../inputs/AccountUserCreateManyWithoutOrganizationInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class OrganizationCreateWithoutProjectsInput {
  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  id?: string | null;

  @Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  createdAt?: Date | null;

  @Field(_type => Date, {
    nullable: true,
    description: undefined
  })
  updatedAt?: Date | null;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  defaultTimeZone!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  address!: string;

  // @Field(_type => AccountUserCreateManyWithoutOrganizationInput, {
  //   nullable: true,
  //   description: undefined
  // })
  //accountUsers?: AccountUserCreateManyWithoutOrganizationInput | null;
}
