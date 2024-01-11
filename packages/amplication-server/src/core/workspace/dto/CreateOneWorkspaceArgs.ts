import { WorkspaceCreateInput } from "./WorkspaceCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateOneWorkspaceArgs {
  @Field(() => WorkspaceCreateInput, { nullable: false })
  data!: WorkspaceCreateInput;
}
