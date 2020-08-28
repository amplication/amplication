import { ArgsType, Field } from '@nestjs/graphql';
import { EntityFieldUpdateInput } from './EntityFieldUpdateInput';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UpdateOneEntityFieldArgs {
  @Field(() => EntityFieldUpdateInput, { nullable: false })
  data!: EntityFieldUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
