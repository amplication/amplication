import { WhereUniqueInput } from "../../../dto/WhereUniqueInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class SetCurrentWorkspaceArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  data!: WhereUniqueInput;
}
