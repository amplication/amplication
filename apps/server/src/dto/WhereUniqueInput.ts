import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class WhereUniqueInput {
  @Field(() => String, {
    nullable: false
  })
  id: string;
}
