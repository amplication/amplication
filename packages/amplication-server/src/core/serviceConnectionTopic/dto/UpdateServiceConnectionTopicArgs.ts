import { ArgsType, Field } from '@nestjs/graphql';
import { UpdateBlockArgs } from '../../block/dto/UpdateBlockArgs';
import { ServiceConnectionTopicUpdateInput } from './ServiceConnectionTopicUpdateInput';

@ArgsType()
export class UpdateServiceConnectionTopicArgs extends UpdateBlockArgs {
  @Field(() => ServiceConnectionTopicUpdateInput, { nullable: false })
  data!: ServiceConnectionTopicUpdateInput;
}
