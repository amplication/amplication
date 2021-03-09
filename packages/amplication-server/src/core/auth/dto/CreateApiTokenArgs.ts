import { ArgsType, Field } from '@nestjs/graphql';
import { ApiTokenCreateInput } from './ApiTokenCreateInput';

@ArgsType()
export class CreateApiTokenArgs {
  @Field(() => ApiTokenCreateInput, { nullable: false })
  data!: ApiTokenCreateInput;
}
