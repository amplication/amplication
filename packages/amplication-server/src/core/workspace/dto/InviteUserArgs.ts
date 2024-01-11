import { InviteUserInput } from "./InviteUserInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class InviteUserArgs {
  @Field(() => InviteUserInput, { nullable: false })
  data!: InviteUserInput;
}
