import { Field, ObjectType } from "@nestjs/graphql";
import { Resource } from "./Resource";
import { BlockVersion } from "./BlockVersion";
import { EnumBlockType } from "../enums/EnumBlockType";

@ObjectType({
  isAbstract: true,
})
export class Block {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
  })
  createdAt!: Date;

  @Field(() => Date, {
    nullable: false,
  })
  updatedAt!: Date;

  /** @todo: do we need the Resource property on the block? should we allow navigation from Block to Resource? */
  @Field(() => Resource, {
    nullable: true,
  })
  resource?: Resource;

  /** Used to resolve the resource property*/
  resourceId: string;

  @Field(() => Block, {
    nullable: true,
  })
  parentBlock?: Block;

  /** Used to resolve parent block */
  parentBlockId?: string;

  @Field(() => String, {
    nullable: false,
  })
  displayName!: string;

  @Field(() => String, {
    nullable: true,
  })
  description?: string;

  @Field(() => EnumBlockType, {
    nullable: false,
  })
  blockType: keyof typeof EnumBlockType;

  @Field(() => Number, {
    nullable: true,
  })
  versionNumber?: number;

  @Field(() => String, {
    nullable: true,
  })
  lockedByUserId?: string;

  @Field(() => Date, {
    nullable: true,
  })
  lockedAt?: Date;

  @Field(() => [BlockVersion], {
    nullable: true,
  })
  versions?: BlockVersion[] | null;
}
