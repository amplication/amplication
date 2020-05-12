import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class AppUpdateInput {
  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  description?: string | null;
}
