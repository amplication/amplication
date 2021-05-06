import { Field, InputType, Float } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class FloatNullableFilter {
  @Field(() => Float, {
    nullable: true,
  })
  equals?: number | null;

  @Field(() => [Float], {
    nullable: true,
  })
  in?: number[] | null;

  @Field(() => [Float], {
    nullable: true,
  })
  notIn?: number[] | null;

  @Field(() => Float, {
    nullable: true,
  })
  lt?: number;

  @Field(() => Float, {
    nullable: true,
  })
  lte?: number;

  @Field(() => Float, {
    nullable: true,
  })
  gt?: number;

  @Field(() => Float, {
    nullable: true,
  })
  gte?: number;

  @Field(() => Float, {
    nullable: true,
  })
  not?: number;
}
