import { Field, InputType } from "@nestjs/graphql";
import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class StringFilter {
  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  equals?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  not?: string | null;

  @Field(_type => [String], {
    nullable: true,
    description: undefined
  })
  in?: string[] | null;

  @Field(_type => [String], {
    nullable: true,
    description: undefined
  })
  notIn?: string[] | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  lt?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  lte?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  gt?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  gte?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  contains?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  startsWith?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  endsWith?: string | null;
}
