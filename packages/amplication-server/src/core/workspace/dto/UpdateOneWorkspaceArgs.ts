import { ArgsType, Field } from "@nestjs/graphql";
import { WorkspaceUpdateInput } from "./WorkspaceUpdateInput";
import { WhereUniqueInput } from "../../../dto";

@ArgsType()
export class UpdateOneWorkspaceArgs {
  @Field(() => WorkspaceUpdateInput, { nullable: false })
  data!: WorkspaceUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
