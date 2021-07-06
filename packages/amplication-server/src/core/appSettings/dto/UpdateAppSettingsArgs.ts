import { ArgsType, Field } from '@nestjs/graphql';
import { UpdateBlockArgs } from '../../block/dto/UpdateBlockArgs';
import { AppSettingsUpdateInput } from './AppSettingsUpdateInput';

@ArgsType()
export class UpdateAppSettingsArgs extends UpdateBlockArgs {
  @Field(() => AppSettingsUpdateInput, { nullable: false })
  data!: AppSettingsUpdateInput;
}
