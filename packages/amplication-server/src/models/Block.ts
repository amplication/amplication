import { Field, ObjectType } from '@nestjs/graphql';
import { App } from './App'; // eslint-disable-line import/no-cycle
import { EnumBlockType } from 'src/enums/EnumBlockType';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Block {
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

  /** @todo: do we need the App property on the block? should we allow navigation from Block to App? */
  @Field(() => App, {
    nullable: true,
    description: undefined
  })
  app?: App;

  /** Used to resolve the app property*/
  appId: string;

  @Field(() => Block, {
    nullable: true,
    description: undefined
  })
  parentBlock?: Block;

  /** Used to resolve parent block */
  parentBlockId?: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  displayName!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  description?: string;

  @Field(() => EnumBlockType, {
    nullable: false,
    description: undefined
  })
  blockType: keyof typeof EnumBlockType;

  @Field(() => Number, {
    nullable: true,
    description: undefined
  })
  versionNumber?: number;
}
