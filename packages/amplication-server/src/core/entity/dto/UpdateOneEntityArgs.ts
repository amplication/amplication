import { ArgsType, Field } from '@nestjs/graphql';
import { EntityUpdateInput } from '.';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class UpdateOneEntityArgs {
  @Field(() => EntityUpdateInput, { nullable: false })
  data!: EntityUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
