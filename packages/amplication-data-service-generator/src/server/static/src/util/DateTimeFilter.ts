import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class DateTimeFilter {
  @Field(() => Date, {
    nullable: false
  })
  equals?: Date ;

  @Field(() => Date, {
    nullable: false
  })
  not?: Date ;

  @Field(() => [Date], {
    nullable: false
  })
  in?: Date[] ;

  @Field(() => [Date], {
    nullable: false
  })
  notIn?: Date[] ;

  @Field(() => Date, {
    nullable: false
  })
  lt?: Date ;

  @Field(() => Date, {
    nullable: false
  })
  lte?: Date ;

  @Field(() => Date, {
    nullable: false
  })
  gt?: Date ;

  @Field(() => Date, {
    nullable: false
  })
  gte?: Date ;
}
