import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class BlockUpdateInput {
  @Field(() => String, {
    nullable: true
  })
  displayName?: string | null;

  @Field(() => String, {
    nullable: true
  })
  description?: string | null;
}
