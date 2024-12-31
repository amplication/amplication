import { ArgsType, Field } from "@nestjs/graphql";
import { WhereTeamAssignmentInput } from "./WhereTeamAssignmentInput";

@ArgsType()
export class DeleteTeamAssignmentArgs {
  @Field(() => WhereTeamAssignmentInput, { nullable: false })
  where!: WhereTeamAssignmentInput;
}
