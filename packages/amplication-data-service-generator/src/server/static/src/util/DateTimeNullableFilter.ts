import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class DateTimeNullableFilter {
  @Field(() => Date, {
    nullable: true
  })
  equals?: Date | null ;


  @Field(() => [Date], {
    nullable: true
  })
  in?: Date[] | null;

  @Field(() => [Date], {
    nullable: true
  })
  notIn?: Date[] | null;

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

  @Field(() => Date, {
    nullable: false
  })
  not?: Date ;
}
