import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { OrganizationCreateWithoutProjectsInput } from "./OrganizationCreateWithoutProjectsInput";
import { OrganizationWhereUniqueInput } from "./";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class OrganizationCreateOneWithoutProjectsInput {
  @Field(_type => OrganizationCreateWithoutProjectsInput, {
    nullable: true,
    description: undefined
  })
  create?: OrganizationCreateWithoutProjectsInput | null;

  @Field(_type => OrganizationWhereUniqueInput, {
    nullable: true,
    description: undefined
  })
  connect?: OrganizationWhereUniqueInput | null;
}
