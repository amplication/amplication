import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Block, BlockInputOutput } from '../models';

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
  block?: Block<any>;

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

  settings?: object;

  inputParameters?: object; /** @todo: change object to actual type */

  outputParameters?: object; /** @todo: change object to actual type */
}
