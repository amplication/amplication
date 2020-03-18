import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { EntityVersion, EntityField } from "./";
import { Project } from "./Project";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class Entity {
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

  project?: Project;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  name!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  displayName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  pluralDisplayName!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  description!: string;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined,
  })
  isPersistent!: boolean;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined,
  })
  allowFeedback!: boolean;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  primaryField!: string;

  entityVersions?: EntityVersion[] | null;
  
  @Field(_type => [EntityField], {
    nullable: false,
    description: undefined,
  })
  entityFields?: EntityField[] | null;

  
}
