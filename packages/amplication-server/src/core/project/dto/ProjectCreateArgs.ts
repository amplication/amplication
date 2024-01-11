import { ProjectCreateInput } from "./ProjectCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class ProjectCreateArgs {
  @Field(() => ProjectCreateInput, { nullable: false })
  data!: ProjectCreateInput;
}
