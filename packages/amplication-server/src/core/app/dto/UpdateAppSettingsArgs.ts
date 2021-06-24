import { ArgsType, Field } from '@nestjs/graphql';
import { AppSettingsUpdateInput } from './AppSettingsUpdateInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UpdateAppSettingsArgs {
  @Field(() => AppSettingsUpdateInput, { nullable: false })
  data!: AppSettingsUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
