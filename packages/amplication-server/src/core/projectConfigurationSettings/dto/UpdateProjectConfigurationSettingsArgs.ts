import { UpdateBlockArgs } from "../../block/dto";
import { ProjectConfigurationSettingsUpdateInput } from "./ProjectConfigurationSettingsUpdateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateProjectConfigurationSettingsArgs extends UpdateBlockArgs {
  @Field(() => ProjectConfigurationSettingsUpdateInput, { nullable: false })
  declare data: ProjectConfigurationSettingsUpdateInput;
}
