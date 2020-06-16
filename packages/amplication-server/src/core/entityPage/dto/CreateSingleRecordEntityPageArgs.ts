import { ArgsType, Field } from '@nestjs/graphql';
import { CreateEntityPageArgs } from './CreateEntityPageArgs';
import { SingleRecordEntityPageCreateInput } from './SingleRecordEntityPageCreateInput';

@ArgsType()
export class CreateSingleRecordEntityPageArgs extends CreateEntityPageArgs {
  @Field(() => SingleRecordEntityPageCreateInput, { nullable: false })
  data!: SingleRecordEntityPageCreateInput;
}
