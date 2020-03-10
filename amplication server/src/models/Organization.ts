import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { AccountUser } from "./AccountUser";
import { Project } from "./Project";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Organization {
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

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  name!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  defaultTimeZone!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  address!: string;

  projects?: Project[] | null;

  accountUsers?: AccountUser[] | null;
}
