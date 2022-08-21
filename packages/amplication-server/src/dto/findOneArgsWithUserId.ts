import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from '../dto/WhereUniqueInput';

@ArgsType()
export class FindOneArgsWithUserId {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
  userId?: string;
}