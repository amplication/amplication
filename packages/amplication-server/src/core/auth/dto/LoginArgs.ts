import { ArgsType, Field } from '@nestjs/graphql';
import { LoginInput } from './login.input';

@ArgsType()
export class LoginArgs {
  @Field(() => LoginInput, { nullable: false })
  data!: LoginInput;
}
