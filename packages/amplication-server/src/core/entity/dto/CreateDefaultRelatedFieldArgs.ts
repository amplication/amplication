import { ArgsType, Field } from '@nestjs/graphql';
import { WhereUniqueInput } from 'src/dto';

@ArgsType()
export class CreateDefaultRelatedFieldArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;

  @Field(() => String, { nullable: true })
  relatedFieldName?: string;

  @Field(() => String, { nullable: true })
  relatedFieldDisplayName?: string;
}
