import { ArgsType, Field } from '@nestjs/graphql';
import { InviteUserInput } from './';

@ArgsType()
export class InviteUserArgs {
  @Field(_type => InviteUserInput, { nullable: false })
  data!: InviteUserInput;
}
