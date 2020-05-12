import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from '../inputs';

@ArgsType()
export class FindOneArgs {
  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
