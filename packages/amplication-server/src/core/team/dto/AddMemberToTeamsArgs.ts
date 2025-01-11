import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { AddMemberToTeamsInput } from "./AddMemberToTeamsInput";

@ArgsType()
export class AddMemberToTeamsArgs {
  @Field(() => AddMemberToTeamsInput, { nullable: false })
  data!: AddMemberToTeamsInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
