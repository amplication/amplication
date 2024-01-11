import { WhereUniqueInput } from "../../../dto";
import { ProjectUpdateInput } from "./ProjectUpdateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateProjectArgs {
  @Field(() => ProjectUpdateInput, { nullable: false })
  data!: ProjectUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
