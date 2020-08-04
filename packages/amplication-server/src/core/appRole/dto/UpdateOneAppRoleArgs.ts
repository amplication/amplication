import { ArgsType, Field } from '@nestjs/graphql';
import { AppRoleUpdateInput } from './AppRoleUpdateInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UpdateOneAppRoleArgs {
  @Field(() => AppRoleUpdateInput, { nullable: false })
  data!: AppRoleUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
