import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class IntNullableFilter {
  @Field(() => Int, {
    nullable: true
  })
  equals?: number | null;
 
  @Field(() => [Int], {
    nullable: true
  })
  in?: number[] | null;

  @Field(() => [Int], {
    nullable: true
  })
  notIn?: number[] | null;

  @Field(() => Int, {
    nullable: false
  })
  lt?: number ;

  @Field(() => Int, {
    nullable: false
  })
  lte?: number ;

  @Field(() => Int, {
    nullable: false
  })
  gt?: number ;

  @Field(() => Int, {
    nullable: false
  })
  gte?: number ;

  @Field(() => Int, {
    nullable: false
  })
  not?: number ;
}
