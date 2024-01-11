import { WhereUniqueInput } from "../../../dto";
import { WorkspaceUpdateInput } from "./WorkspaceUpdateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateOneWorkspaceArgs {
  @Field(() => WorkspaceUpdateInput, { nullable: false })
  data!: WorkspaceUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
