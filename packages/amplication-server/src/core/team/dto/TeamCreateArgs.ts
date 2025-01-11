import { ArgsType, Field } from "@nestjs/graphql";
import { TeamCreateInput } from "./TeamCreateInput";

@ArgsType()
export class TeamCreateArgs {
  @Field(() => TeamCreateInput, { nullable: false })
  data!: TeamCreateInput;
}
