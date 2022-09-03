import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from 'src/models';
import { EnumServiceConnectionTopicMessagePattern } from './EnumServiceConnectionTopicMessagePattern';

@ObjectType({
  isAbstract: true,
  implements: [IBlock]
})
export class ServiceConnectionTopic extends IBlock {
  @Field(() => EnumServiceConnectionTopicMessagePattern, {
    nullable: false
  })
  messagePattern!: EnumServiceConnectionTopicMessagePattern;
}
