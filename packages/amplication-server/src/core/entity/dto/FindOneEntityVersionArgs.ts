import { ArgsType, Field } from '@nestjs/graphql';
import { FindOneEntityVersionWhereInput } from './FindOneEntityVersionWhereInput';

@ArgsType()
export class FindOneEntityVersionArgs {
  @Field(() => FindOneEntityVersionWhereInput, { nullable: false })
  where!: FindOneEntityVersionWhereInput;
}
