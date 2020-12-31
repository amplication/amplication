import { ArgsType, Field } from '@nestjs/graphql';
import { LookupEntityFieldCreateInput } from './LookupEntityFieldCreateInput';

@ArgsType()
export class CreateLookupEntityFieldArgs {
  @Field(() => LookupEntityFieldCreateInput, { nullable: false })
  data!: LookupEntityFieldCreateInput;

  @Field(() => String, { nullable: false })
  relatedFieldName!: string;

  @Field(() => String, { nullable: false })
  relatedFieldDisplayName!: string;
}
