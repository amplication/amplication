import { Field, ObjectType, InterfaceType } from '@nestjs/graphql';
import { App, BlockInputOutput } from './';
import { EnumBlockType } from 'src/enums/EnumBlockType';

@InterfaceType({
  resolveType: value => {
    return value.blockType; // schema name of the type
  }
})
@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Block<T> {
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
  parentBlock?: Block<any>;

  /** Used to resolve parent block */
  parentBlockId?: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

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

  settings?: T;

  @Field(() => [BlockInputOutput], {
    nullable: true,
    description: undefined
  })
  inputParameters?: BlockInputOutput[];

  @Field(() => [BlockInputOutput], {
    nullable: true,
    description: undefined
  })
  outputParameters?: BlockInputOutput[];
}
