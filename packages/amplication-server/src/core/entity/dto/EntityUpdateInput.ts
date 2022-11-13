import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class EntityUpdateInput {
  @Field(() => String, {
    nullable: true
  })
  name?: string | null;

  @Field(() => String, {
    nullable: true
  })
  displayName?: string | null;

  @Field(() => String, {
    nullable: true
  })
  pluralDisplayName?: string | null;

  @Field(() => String, {
    nullable: true
  })
  description?: string | null;
}
