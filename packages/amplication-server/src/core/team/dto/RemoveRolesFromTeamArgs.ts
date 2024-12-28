import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { TeamUpdateRolesInput } from "./TeamUpdateRolesInput";

@ArgsType()
export class RemoveRolesFromTeamArgs {
  @Field(() => TeamUpdateRolesInput, { nullable: false })
  data!: TeamUpdateRolesInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
