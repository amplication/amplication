import { ArgsType, Field } from '@nestjs/graphql';
import { WhereParentIdInput } from '../../../dto/inputs';
import { EntityFieldCreateInput } from './';

@ArgsType()
export class CreateOneEntityFieldArgs {
  @Field(_type => EntityFieldCreateInput, { nullable: false })
  data!: EntityFieldCreateInput;
  // @Field(_type => WhereParentIdInput, { nullable: false })
  // where :WhereParentIdInput;
}
