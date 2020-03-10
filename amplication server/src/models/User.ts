import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { Post } from '../models/Post';
import { Role } from '../enums/Role';

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class User {
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
  email!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  password!: string;

  @Field(_type => String, {
    nullable: true,
    description: undefined,
  })
  firstname?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined,
  })
  lastname?: string | null;

  posts?: Post[] | null;

  @Field(_type => Role, {
    nullable: false,
    description: undefined,
  })
  role!: keyof typeof Role;
}
