import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class DeleteOneEntityArgs {
  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
