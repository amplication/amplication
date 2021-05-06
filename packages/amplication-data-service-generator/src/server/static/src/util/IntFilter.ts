import { Field, InputType, Int } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class IntFilter {
  @Field(() => Int, {
    nullable: false
  })
  equals?: number ;
 
  @Field(() => [Int], {
    nullable: false
  })
  in?: number[] ;

  @Field(() => [Int], {
    nullable: false
  })
  notIn?: number[] ;

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
