import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from '../../../dto';

@ArgsType()
export class DeleteOneEntityArgs {
  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
