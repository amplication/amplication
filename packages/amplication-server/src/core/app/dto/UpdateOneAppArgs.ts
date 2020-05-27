import { ArgsType, Field } from '@nestjs/graphql';
import { AppUpdateInput } from './';
import { WhereUniqueInput } from '../../../dto/inputs';

@ArgsType()
export class UpdateOneAppArgs {
  @Field(_type => AppUpdateInput, { nullable: false })
  data!: AppUpdateInput;

  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
