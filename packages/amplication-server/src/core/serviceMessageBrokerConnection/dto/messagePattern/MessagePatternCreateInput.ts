import { Field, InputType } from '@nestjs/graphql';
import { EnumMessagePatternConnectionOptions } from './EnumMessagePatternConnectionOptions';

@InputType()
export class MessagePatternCreateInput {
  @Field(() => String, { nullable: false })
  pattern!: string;

  @Field(() => EnumMessagePatternConnectionOptions, { nullable: false })
  type!: keyof typeof EnumMessagePatternConnectionOptions;
}
