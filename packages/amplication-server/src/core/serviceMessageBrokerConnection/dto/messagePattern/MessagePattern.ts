import { Field, ObjectType } from '@nestjs/graphql';
import { EnumMessagePatternConnectionOptions } from './EnumMessagePatternConnectionOptions';

@ObjectType()
export class MessagePattern {
  @Field(() => String, { nullable: false })
  pattern!: string;

  @Field(() => EnumMessagePatternConnectionOptions, { nullable: false })
  type!: keyof typeof EnumMessagePatternConnectionOptions;
}
