import { CompleteInvitationInput } from "./CompleteInvitationInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CompleteInvitationArgs {
  @Field(() => CompleteInvitationInput, { nullable: false })
  data!: CompleteInvitationInput;
}
