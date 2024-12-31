import { ArgsType, Field } from "@nestjs/graphql";
import { WhereTeamAssignmentInput } from "./WhereTeamAssignmentInput";
import { TeamUpdateRolesInput } from "./TeamUpdateRolesInput";

@ArgsType()
export class AddRolesToTeamAssignmentArgs {
  @Field(() => TeamUpdateRolesInput, { nullable: false })
  data!: TeamUpdateRolesInput;

  @Field(() => WhereTeamAssignmentInput, { nullable: false })
  where!: WhereTeamAssignmentInput;
}
