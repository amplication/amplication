import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class BlockUpdateInput {
  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  description?: string | null;
}
