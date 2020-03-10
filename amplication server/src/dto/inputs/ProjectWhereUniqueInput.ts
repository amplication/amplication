import { Arg, ArgsType, Field, FieldResolver, Float, ID, InputType, Int, ObjectType, registerEnumType } from "type-graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";

@InputType(
  "ProjectWhereUniqueInput2",
   {  isAbstract: true,
  description: undefined  
})
export class ProjectWhereUniqueInput1 {
  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  id?: string | null;
}
