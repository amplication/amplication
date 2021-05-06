import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class BooleanFilter {
  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  equals?: boolean ;

  @Field(() => Boolean, {
    nullable: false,
    description: undefined
  })
  not?: boolean ;
}
