import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class WorkspaceUpdateInput {
  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  name?: string | null;
}
