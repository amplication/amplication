import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class IntFilter {
  @Field(() => Int, {
    nullable: true,
    description: undefined
  })
  equals?: number | null;

  @Field(() => Int, {
    nullable: true,
    description: undefined
  })
  not?: number | null;

  @Field(() => [Int], {
    nullable: true,
    description: undefined
  })
  in?: number[] | null;

  @Field(() => [Int], {
    nullable: true,
    description: undefined
  })
  notIn?: number[] | null;

  @Field(() => Int, {
    nullable: true,
    description: undefined
  })
  lt?: number | null;

  @Field(() => Int, {
    nullable: true,
    description: undefined
  })
  lte?: number | null;

  @Field(() => Int, {
    nullable: true,
    description: undefined
  })
  gt?: number | null;

  @Field(() => Int, {
    nullable: true,
    description: undefined
  })
  gte?: number | null;
}
