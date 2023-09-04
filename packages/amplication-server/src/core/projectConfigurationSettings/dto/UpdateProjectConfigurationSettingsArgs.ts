import { ArgsType, Field } from "@nestjs/graphql";
import { UpdateBlockArgs } from "../../block/dto";
import { ProjectConfigurationSettingsUpdateInput } from "./ProjectConfigurationSettingsUpdateInput";

@ArgsType()
export class UpdateProjectConfigurationSettingsArgs extends UpdateBlockArgs {
  @Field(() => ProjectConfigurationSettingsUpdateInput, { nullable: false })
  declare data: ProjectConfigurationSettingsUpdateInput;
}
