import { GraphQLJSONObject } from 'graphql-type-json';
import { JsonValue } from 'type-fest';
import { ObjectType, Field } from '@nestjs/graphql';
import { EnumBuildLogLevel } from './EnumBuildLogLevel';

@ObjectType({
  isAbstract: true
})
export class BuildLog {
  @Field(() => String, {})
  id!: string;

  @Field(() => Date, {})
  createdAt!: Date;

  @Field(() => String)
  message!: string;

  @Field(() => GraphQLJSONObject)
  meta!: JsonValue;

  @Field(() => EnumBuildLogLevel)
  level!: keyof typeof EnumBuildLogLevel;
}
