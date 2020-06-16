import { ArgsType, Field } from '@nestjs/graphql';
import { CreateEntityPageArgs } from './CreateEntityPageArgs';
import { ListEntityPageCreateInput } from './ListEntityPageCreateInput';

@ArgsType()
export class CreateListEntityPageArgs extends CreateEntityPageArgs {
  @Field(() => ListEntityPageCreateInput, { nullable: false })
  data!: ListEntityPageCreateInput;
}
