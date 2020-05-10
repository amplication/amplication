import { ArgsType, Field } from '@nestjs/graphql';
import { EntityUpdateInput } from '../inputs/EntityUpdateInput';
import { WhereUniqueInput } from '../inputs/WhereUniqueInput';

@ArgsType()
export class UpdateOneEntityArgs {
  @Field(_type => EntityUpdateInput, { nullable: false })
  data!: EntityUpdateInput;

  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
