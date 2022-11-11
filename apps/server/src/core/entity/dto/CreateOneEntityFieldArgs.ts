import { ArgsType, Field } from '@nestjs/graphql';
import { EntityFieldCreateInput } from './EntityFieldCreateInput';

@ArgsType()
export class CreateOneEntityFieldArgs {
  @Field(() => EntityFieldCreateInput, { nullable: false })
  data!: EntityFieldCreateInput;

  @Field(() => String, { nullable: true })
  relatedFieldName?: string;

  @Field(() => String, { nullable: true })
  relatedFieldDisplayName?: string;
}
