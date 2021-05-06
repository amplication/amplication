import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
  description: undefined,
})
export class DateTimeFilter {
  @Field(() => Date, {
    nullable: true,
  })
  equals?: Date;

  @Field(() => Date, {
    nullable: true,
  })
  not?: Date;

  @Field(() => [Date], {
    nullable: true,
  })
  in?: Date[];

  @Field(() => [Date], {
    nullable: true,
  })
  notIn?: Date[];

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
}
