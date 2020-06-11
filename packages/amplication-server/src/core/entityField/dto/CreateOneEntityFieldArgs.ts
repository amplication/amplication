import { ArgsType, Field } from '@nestjs/graphql';
import { EntityFieldCreateInput } from './';

@ArgsType()
export class CreateOneEntityFieldArgs {
  @Field(() => EntityFieldCreateInput, { nullable: false })
  data!: EntityFieldCreateInput;
  // @Field(() => WhereParentIdInput, { nullable: false })
  // where :WhereParentIdInput;
}
