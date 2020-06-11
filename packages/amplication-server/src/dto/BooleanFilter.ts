import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class BooleanFilter {
  @Field(() => Boolean, {
    nullable: true,
    description: undefined
  })
  equals?: boolean | null;

  @Field(() => Boolean, {
    nullable: true,
    description: undefined
  })
  not?: boolean | null;
}
