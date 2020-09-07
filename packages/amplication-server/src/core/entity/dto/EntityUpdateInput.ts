import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityUpdateInput {
  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  displayName?: string | null;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  pluralDisplayName?: string | null;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  description?: string | null;
}
