import { Field, InputType, Float } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class FloatNullableFilter {
  @Field(() => Float, {
    nullable: true
  })
  equals?: number | null;
 
  @Field(() => [Float], {
    nullable: true
  })
  in?: number[] | null;

  @Field(() => [Float], {
    nullable: true
  })
  notIn?: number[] | null;

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
