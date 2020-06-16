import { ArgsType, Field } from '@nestjs/graphql';
import { InviteUserInput } from './InviteUserInput';

@ArgsType()
export class InviteUserArgs {
  @Field(() => InviteUserInput, { nullable: false })
  data!: InviteUserInput;
}
