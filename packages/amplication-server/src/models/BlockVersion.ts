import { JsonObject, JsonArray } from 'type-fest';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Block } from './Block';
import { BlockInputOutput } from './BlockInputOutput';

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

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  label!: string;

  settings?: JsonObject;

  inputParameters?: {
    params: BlockInputOutput[] & JsonArray;
  };

  outputParameters?: {
    params: BlockInputOutput[] & JsonArray;
  };
}
