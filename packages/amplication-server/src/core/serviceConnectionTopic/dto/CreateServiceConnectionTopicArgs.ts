import { ArgsType, Field } from '@nestjs/graphql';
import { ServiceConnectionTopicCreateInput } from './ServiceConnectionTopicCreateInput';

@ArgsType()
export class CreateServiceConnectionTopicArgs {
  @Field(() => ServiceConnectionTopicCreateInput, { nullable: false })
  data!: ServiceConnectionTopicCreateInput;
}
