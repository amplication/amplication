import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class AppUpdateInput {
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

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  color?: string | null;
}
