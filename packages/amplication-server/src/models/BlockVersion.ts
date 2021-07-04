import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { JsonValue } from 'type-fest';
import { Commit } from '../models/Commit'; // eslint-disable-line import/no-cycle
import { Block } from './Block'; // eslint-disable-line import/no-cycle
@ObjectType({
  isAbstract: true,
  description: undefined
})
export class BlockVersion {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt!: Date;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  displayName!: string;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  description?: string;

  @Field(() => Block, {
    nullable: false,
    description: undefined
  })
  block?: Block;

  @Field(() => Int, {
    nullable: false,
    description: undefined
  })
  versionNumber!: number;

  commitId?: string | null;

  @Field(() => Commit, {
    nullable: true,
    description: undefined
  })
  commit?: Commit;

  @Field(() => GraphQLJSONObject, {
    nullable: true,
    description: undefined
  })
  settings?: JsonValue;

  inputParameters?: JsonValue;

  outputParameters?: JsonValue;
}
