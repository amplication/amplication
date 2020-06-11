import { ArgsType, Field } from '@nestjs/graphql';
import { InviteUserInput } from './';

@ArgsType()
export class InviteUserArgs {
  @Field(() => InviteUserInput, { nullable: false })
  data!: InviteUserInput;
}
