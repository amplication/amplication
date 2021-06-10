import { Field, InputType } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class WorkspaceCreateInput {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;
}
