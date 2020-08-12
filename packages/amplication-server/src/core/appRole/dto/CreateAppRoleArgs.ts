import { ArgsType, Field } from '@nestjs/graphql';
import { AppRoleCreateInput } from './AppRoleCreateInput';

@ArgsType()
export class CreateAppRoleArgs {
  @Field(() => AppRoleCreateInput, { nullable: false })
  data!: AppRoleCreateInput;
}
