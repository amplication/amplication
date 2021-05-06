import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class DateTimeNullableFilter {
  @Field(() => Date, {
    nullable: true,
  })
  equals?: Date | null;

  @Field(() => [Date], {
    nullable: true,
  })
  in?: Date[] | null;

  @Field(() => [Date], {
    nullable: true,
  })
  notIn?: Date[] | null;

  @Field(() => Date, {
    nullable: true,
  })
  lt?: Date;

  @Field(() => Date, {
    nullable: true,
  })
  lte?: Date;

  @Field(() => Date, {
    nullable: true,
  })
  gt?: Date;

  @Field(() => Date, {
    nullable: true,
  })
  gte?: Date;

  @Field(() => Date, {
    nullable: true,
  })
  not?: Date;
}
