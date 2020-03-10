import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { ProjectCreateInput } from '../inputs/ProjectCreateInput';

@ArgsType()
export class CreateOneProjectArgs {
  @Field(_type => ProjectCreateInput, { nullable: false })
  data!: ProjectCreateInput;
}
