import { ArgsType, Field } from '@nestjs/graphql';
import { EntityFieldCreateByDisplayNameInput } from './EntityFieldCreateByDisplayNameInput';

@ArgsType()
export class CreateOneEntityFieldByDisplayNameArgs {
  @Field(() => EntityFieldCreateByDisplayNameInput, { nullable: false })
  data!: EntityFieldCreateByDisplayNameInput;
}
