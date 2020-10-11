import { InputType, Field } from '@nestjs/graphql';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true
})
export class DeploymentCreateInput {
  // Do not expose, injected by the context
  createdBy: WhereParentIdInput;

  @Field(() => WhereParentIdInput)
  build!: WhereParentIdInput;

  @Field(() => WhereParentIdInput)
  environment!: WhereParentIdInput;

  @Field(() => String, {
    nullable: true
  })
  message?: string;
}
