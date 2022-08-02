import { ArgsType, Field } from '@nestjs/graphql';
import { PendingChangesFindInput } from './PendingChangesFindInput';

@ArgsType()
export class FindPendingChangesArgs {
  @Field(() => PendingChangesFindInput, { nullable: false })
  where!: PendingChangesFindInput;
}
