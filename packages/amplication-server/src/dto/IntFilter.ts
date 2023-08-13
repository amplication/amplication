import { Field, InputType, Int } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class IntFilter {
  @Field(() => Int, {
    nullable: true,
  })
  equals?: number | null;

  @Field(() => Int, {
    nullable: true,
  })
  not?: number | null;

  @Field(() => [Int], {
    nullable: true,
  })
  in?: number[] | null;

  @Field(() => [Int], {
    nullable: true,
  })
  notIn?: number[] | null;

  @Field(() => Int, {
    nullable: true,
  })
  lt?: number | null;

  @Field(() => Int, {
    nullable: true,
  })
  lte?: number | null;

  @Field(() => Int, {
    nullable: true,
  })
  gt?: number | null;

  @Field(() => Int, {
    nullable: true,
  })
  gte?: number | null;
}
