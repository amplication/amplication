import { ArgsType, Field } from '@nestjs/graphql';
import { AppUpdateInput } from './AppUpdateInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UpdateOneAppArgs {
  @Field(() => AppUpdateInput, { nullable: false })
  data!: AppUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
