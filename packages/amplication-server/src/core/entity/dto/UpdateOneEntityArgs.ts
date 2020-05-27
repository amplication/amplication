import { ArgsType, Field } from '@nestjs/graphql';
import { EntityUpdateInput } from '.';
import { WhereUniqueInput } from '../../../dto/inputs';

@ArgsType()
export class UpdateOneEntityArgs {
  @Field(_type => EntityUpdateInput, { nullable: false })
  data!: EntityUpdateInput;

  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
