import { ArgsType, Field } from "@nestjs/graphql";
import { InviteUserInput } from '../inputs';

@ArgsType()
export class InviteUserArgs {
  @Field(_type => InviteUserInput, { nullable: false })
  data!: InviteUserInput;
}
