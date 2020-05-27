import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from '../../../dto';

@ArgsType()
export class FindOneEntityArgs {
  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;

  @Field(_type => Number, { nullable: true })
  version: number;
}
