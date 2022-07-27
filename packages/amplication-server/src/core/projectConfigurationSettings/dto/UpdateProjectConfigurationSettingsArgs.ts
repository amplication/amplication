import { ArgsType, Field } from '@nestjs/graphql';
import { UpdateBlockArgs } from 'src/core/block/dto';
import { ProjectConfigurationSettingsUpdateInput } from './ProjectConfigurationSettingsUpdateInput';

@ArgsType()
export class UpdateProjectConfigurationSettingsArgs extends UpdateBlockArgs {
  @Field(() => ProjectConfigurationSettingsUpdateInput, { nullable: false })
  data!: ProjectConfigurationSettingsUpdateInput;
}
