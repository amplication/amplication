import { ArgsType, Field } from "@nestjs/graphql";
import { CompleteInvitationInput } from "./CompleteInvitationInput";

@ArgsType()
export class CompleteInvitationArgs {
  @Field(() => CompleteInvitationInput, { nullable: false })
  data!: CompleteInvitationInput;
}
