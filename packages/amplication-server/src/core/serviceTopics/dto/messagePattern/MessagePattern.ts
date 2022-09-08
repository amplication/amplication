import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { EnumMessagePatternConnectionOptions } from '@amplication/code-gen-types';

registerEnumType(EnumMessagePatternConnectionOptions, {
  name: 'EnumMessagePatternConnectionOptions'
});

@ObjectType()
export class MessagePattern {
  @Field(() => String, { nullable: false })
  topicId!: string;

  @Field(() => EnumMessagePatternConnectionOptions, { nullable: false })
  type!: EnumMessagePatternConnectionOptions;
}
