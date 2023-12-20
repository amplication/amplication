import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class DateTimeFilter {
  @Field(() => Date, {
    nullable: true,
  })
  equals?: Date | null;

  @Field(() => Date, {
    nullable: true,
  })
  not?: Date | null;

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
  lt?: Date | null;

  @Field(() => Date, {
    nullable: true,
  })
  lte?: Date | null;

  @Field(() => Date, {
    nullable: true,
  })
  gt?: Date | null;

  @Field(() => Date, {
    nullable: true,
  })
  gte?: Date | null;
}
