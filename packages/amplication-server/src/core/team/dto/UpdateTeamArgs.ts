import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { TeamUpdateInput } from "./TeamUpdateInput";

@ArgsType()
export class UpdateTeamArgs {
  @Field(() => TeamUpdateInput, { nullable: false })
  data!: TeamUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
