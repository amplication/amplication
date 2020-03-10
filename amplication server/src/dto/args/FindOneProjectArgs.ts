import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { ProjectWhereUniqueInput1 } from '../inputs';

@ArgsType()
export class FindOneProjectArgs {
  @Field(_type => ProjectWhereUniqueInput1, { nullable: false })
  where!: ProjectWhereUniqueInput1;
}
