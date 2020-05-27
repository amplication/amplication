import { ArgsType, Field } from '@nestjs/graphql';
import { EntityFieldUpdateInput } from './';
import { WhereUniqueInput } from '../../../dto';

@ArgsType()
export class UpdateOneEntityFieldArgs {
  @Field(_type => EntityFieldUpdateInput, { nullable: false })
  data!: EntityFieldUpdateInput;

  @Field(_type => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
