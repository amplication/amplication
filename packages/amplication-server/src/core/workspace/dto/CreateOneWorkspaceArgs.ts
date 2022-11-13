import { ArgsType, Field } from '@nestjs/graphql';
import { WorkspaceCreateInput } from './WorkspaceCreateInput';

@ArgsType()
export class CreateOneWorkspaceArgs {
  @Field(() => WorkspaceCreateInput, { nullable: false })
  data!: WorkspaceCreateInput;
}
