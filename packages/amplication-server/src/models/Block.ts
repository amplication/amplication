import { Field, ObjectType } from '@nestjs/graphql';
import { Resource } from './Resource'; // eslint-disable-line import/no-cycle
import { BlockVersion } from './BlockVersion'; // eslint-disable-line import/no-cycle
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

  /** @todo: do we need the Resource property on the block? should we allow navigation from Block to Resource? */
  @Field(() => Resource, {
    nullable: true,
    description: undefined
  })
  resource?: Resource;

  /** Used to resolve the resource property*/
  resourceId: string;

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
    nullable: true,
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

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  lockedByUserId?: string;

  @Field(() => Date, {
    nullable: true,
    description: undefined
  })
  lockedAt?: Date;

  @Field(() => [BlockVersion], {
    nullable: true
  })
  versions?: BlockVersion[] | null;
}
