import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { ProjectUpdateInput } from "../inputs";
import { ProjectWhereUniqueInput } from "../inputs";

@ArgsType()
export class UpdateOneProjectArgs {
  @Field(_type => ProjectUpdateInput, { nullable: false })
  data!: ProjectUpdateInput;

  @Field(_type => ProjectWhereUniqueInput, { nullable: false })
  where!: ProjectWhereUniqueInput;
}
