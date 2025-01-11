import { ArgsType, Field } from "@nestjs/graphql";
import { CreateTeamAssignmentsWhereInput } from "./CreateTeamAssignmentsWhereInput";
import { CreateTeamAssignmentsInput } from "./CreateTeamAssignmentsInput";

@ArgsType()
export class CreateTeamAssignmentsArgs {
  @Field(() => CreateTeamAssignmentsWhereInput, { nullable: false })
  where!: CreateTeamAssignmentsWhereInput;

  @Field(() => CreateTeamAssignmentsInput, { nullable: false })
  data!: CreateTeamAssignmentsInput;
}
