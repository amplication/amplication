import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { BooleanFilter } from "./BooleanFilter";
import { DateTimeFilter } from "./DateTimeFilter";
import { EntityFieldFilter } from "./EntityFieldFilter";
import { ProjectWhereInput } from "./ProjectWhereInput";
import { StringFilter } from "./StringFilter";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class EntityWhereInput {
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

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  name?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  displayName?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  pluralDisplayName?: StringFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  description?: StringFilter | null;

  @Field(_type => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  isPersistent?: BooleanFilter | null;

  @Field(_type => BooleanFilter, {
    nullable: true,
    description: undefined
  })
  allowFeedback?: BooleanFilter | null;

  @Field(_type => StringFilter, {
    nullable: true,
    description: undefined
  })
  primaryField?: StringFilter | null;

  @Field(_type => EntityFieldFilter, {
    nullable: true,
    description: undefined
  })
  entityFields?: EntityFieldFilter | null;

  @Field(_type => [EntityWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: EntityWhereInput[] | null;

  @Field(_type => [EntityWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: EntityWhereInput[] | null;

  @Field(_type => [EntityWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: EntityWhereInput[] | null;

  @Field(_type => ProjectWhereInput, {
    nullable: true,
    description: undefined
  })
  projects?: ProjectWhereInput | null;
}
