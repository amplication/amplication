import { registerEnumType } from '@nestjs/graphql';

export enum EnumServiceConnectionTopicMessagePattern {
  Send = 'Send',
  Receive = 'Receive'
}

registerEnumType(EnumServiceConnectionTopicMessagePattern, {
  name: 'EnumServiceConnectionTopicMessagePattern'
});
