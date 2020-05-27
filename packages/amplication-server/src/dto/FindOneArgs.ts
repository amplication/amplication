import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from '../dto';

@ArgsType()
export class FindOneArgs {
  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
