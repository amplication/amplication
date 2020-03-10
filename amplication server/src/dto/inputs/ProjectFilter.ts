import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { ProjectWhereInput } from "./ProjectWhereInput";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class ProjectFilter {
  @Field(_type => ProjectWhereInput, {
    nullable: true,
    description: undefined
  })
  every?: ProjectWhereInput | null;

  @Field(_type => ProjectWhereInput, {
    nullable: true,
    description: undefined
  })
  some?: ProjectWhereInput | null;

  @Field(_type => ProjectWhereInput, {
    nullable: true,
    description: undefined
  })
  none?: ProjectWhereInput | null;
}
