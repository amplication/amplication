import { ArgsType, Field } from '@nestjs/graphql';
import { PendingChangesDiscardInput } from './PendingChangesDiscardInput';

@ArgsType()
export class DiscardPendingChangesArgs {
  @Field(() => PendingChangesDiscardInput, { nullable: false })
  data!: PendingChangesDiscardInput;
}
