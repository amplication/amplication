import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { User } from "../models/User";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Post {
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

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined,
  })
  published!: boolean;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  title!: string;

  @Field(_type => String, {
    nullable: true,
    description: undefined,
  })
  content?: string | null;

  author?: User | null;
}
