import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class DateTimeFilter {
  @Field(() => Date, {
    nullable: true,
    description: undefined
  })
  equals?: Date | null;

  @Field(() => Date, {
    nullable: true,
    description: undefined
  })
  not?: Date | null;

  @Field(() => [Date], {
    nullable: true,
    description: undefined
  })
  in?: Date[] | null;

  @Field(() => [Date], {
    nullable: true,
    description: undefined
  })
  notIn?: Date[] | null;

  @Field(() => Date, {
    nullable: true,
    description: undefined
  })
  lt?: Date | null;

  @Field(() => Date, {
    nullable: true,
    description: undefined
  })
  lte?: Date | null;

  @Field(() => Date, {
    nullable: true,
    description: undefined
  })
  gt?: Date | null;

  @Field(() => Date, {
    nullable: true,
    description: undefined
  })
  gte?: Date | null;
}
