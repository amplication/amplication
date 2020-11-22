import { InputType, Field } from '@nestjs/graphql';
import { WhereParentIdInput } from 'src/dto';

@InputType({
  isAbstract: true
})
export class BuildCreateInput {
  // Do not expose, injected by the context
  createdBy: WhereParentIdInput;

  @Field(() => WhereParentIdInput)
  app!: WhereParentIdInput;

  @Field(() => String)
  message: string;

  @Field(() => WhereParentIdInput)
  commit: WhereParentIdInput;
}
