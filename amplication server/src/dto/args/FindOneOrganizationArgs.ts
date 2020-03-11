import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { OrganizationWhereUniqueInput } from "../inputs";

@ArgsType()
export class FindOneOrganizationArgs {
  @Field(_type => OrganizationWhereUniqueInput, { nullable: false })
  where!: OrganizationWhereUniqueInput;
}
