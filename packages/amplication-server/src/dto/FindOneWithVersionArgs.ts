import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from './';

@ArgsType()
export class FindOneWithVersionArgs {
  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;

  @Field(_type => Number, { nullable: true })
  version: number;
}
