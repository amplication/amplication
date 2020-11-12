import { ArgsType, Field } from '@nestjs/graphql';
import { SignupInput } from './signup.input';

@ArgsType()
export class SignupArgs {
  @Field(() => SignupInput, { nullable: false })
  data!: SignupInput;
}
