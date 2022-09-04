import { Field, InputType } from '@nestjs/graphql';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';
import { EnumServiceConnectionTopicMessagePattern } from './EnumServiceConnectionTopicMessagePattern';

@InputType({
  isAbstract: true
})
export class ServiceConnectionTopicCreateInput extends BlockCreateInput {
  @Field(() => EnumServiceConnectionTopicMessagePattern, {
    nullable: false
  })
  messagePattern!: EnumServiceConnectionTopicMessagePattern;
}
