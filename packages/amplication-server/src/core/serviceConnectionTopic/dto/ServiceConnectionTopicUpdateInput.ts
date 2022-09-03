import { Field, InputType } from '@nestjs/graphql';
import { BlockUpdateInput } from '../../block/dto/BlockUpdateInput';
import { EnumServiceConnectionTopicMessagePattern } from './EnumServiceConnectionTopicMessagePattern';

@InputType({
  isAbstract: true
})
export class ServiceConnectionTopicUpdateInput extends BlockUpdateInput {
  @Field(() => EnumServiceConnectionTopicMessagePattern, {
    nullable: false
  })
  messagePattern!: EnumServiceConnectionTopicMessagePattern;
}
