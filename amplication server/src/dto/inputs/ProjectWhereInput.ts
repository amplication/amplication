import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { DateTimeFilter } from "./DateTimeFilter";
import { EntityFilter } from "./EntityFilter";
import { OrganizationWhereInput } from "./OrganizationWhereInput";
import { StringFilter } from "./StringFilter";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class ProjectWhereInput {
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
  defaultTimeZone?: StringFilter | null;


  @Field(_type => [ProjectWhereInput], {
    nullable: true,
    description: undefined
  })
  AND?: ProjectWhereInput[] | null;

  @Field(_type => [ProjectWhereInput], {
    nullable: true,
    description: undefined
  })
  OR?: ProjectWhereInput[] | null;

  @Field(_type => [ProjectWhereInput], {
    nullable: true,
    description: undefined
  })
  NOT?: ProjectWhereInput[] | null;

  @Field(_type => OrganizationWhereInput, {
    nullable: true,
    description: undefined
  })
  organization?: OrganizationWhereInput | null;
}
