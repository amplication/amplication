import { ArgsType, Field } from '@nestjs/graphql';
import { ChangePasswordInput } from './change-password.input';

@ArgsType()
export class ChangePasswordArgs {
  @Field(() => ChangePasswordInput, { nullable: false })
  data!: ChangePasswordInput;
}
