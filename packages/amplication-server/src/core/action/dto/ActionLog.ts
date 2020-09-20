import { GraphQLJSONObject } from 'graphql-type-json';
import { JsonValue } from 'type-fest';
import { ObjectType, Field } from '@nestjs/graphql';
import { EnumActionLogLevel } from './EnumActionLogLevel';

@ObjectType({
  isAbstract: true
})
export class ActionLog {
  @Field(() => String, {})
  id!: string;

  @Field(() => Date, {})
  createdAt!: Date;

  @Field(() => String)
  message!: string;

  @Field(() => GraphQLJSONObject)
  meta!: JsonValue;

  @Field(() => EnumActionLogLevel)
  level!: keyof typeof EnumActionLogLevel;
}
