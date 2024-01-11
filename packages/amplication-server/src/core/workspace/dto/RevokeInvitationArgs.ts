import { WhereUniqueInput } from "../../../dto";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class RevokeInvitationArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
