import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from './';

@ArgsType()
export class FindOneWithVersionArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;

  @Field(() => Number, { nullable: true })
  version: number;
}
