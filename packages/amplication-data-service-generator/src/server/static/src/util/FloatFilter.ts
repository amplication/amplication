import { Field, InputType, Float } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class FloatFilter {
  @Field(() => Float, {
    nullable: false
  })
  equals?: number ;
 
  @Field(() => [Float], {
    nullable: false
  })
  in?: number[] ;

  @Field(() => [Float], {
    nullable: false
  })
  notIn?: number[] ;

  @Field(() => Float, {
    nullable: false
  })
  lt?: number ;

  @Field(() => Float, {
    nullable: false
  })
  lte?: number ;

  @Field(() => Float, {
    nullable: false
  })
  gt?: number ;

  @Field(() => Float, {
    nullable: false
  })
  gte?: number ;

  @Field(() => Float, {
    nullable: false
  })
  not?: number ;
}
