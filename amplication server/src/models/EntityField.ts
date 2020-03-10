import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { Entity } from "./Entity";
import { EnumDataType } from './../enums/EnumDataType';

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class EntityField {
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

  @Field(_type => EnumDataType, {
    nullable: false,
    description: undefined,
  })
  dataType!: keyof typeof EnumDataType;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  dataTypeProperties!: string;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  properties!: string;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined,
  })
  required!: boolean;

  @Field(_type => Boolean, {
    nullable: false,
    description: undefined,
  })
  searchable!: boolean;

  @Field(_type => String, {
    nullable: false,
    description: undefined,
  })
  description!: string;
}
