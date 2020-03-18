import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { Entity } from "../models/Entity";
import { EntityField } from "../models/EntityField";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class EntityVersion {
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

  entity?: Entity;

  @Field(_type => Int, {
    nullable: false,
    description: undefined,
  })
  versionNumber!: number;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  Label!: string;

  entityFields?: EntityField[] | null;
}
