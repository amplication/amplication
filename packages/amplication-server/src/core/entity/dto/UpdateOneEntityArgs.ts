import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from 'src/dto';
import { EntityUpdateInput } from './EntityUpdateInput';

@ArgsType()
export class UpdateOneEntityArgs {
  @Field(() => EntityUpdateInput, { nullable: false })
  data!: EntityUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
