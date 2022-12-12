import { InterfaceType, Field } from "@nestjs/graphql";
import { EnumBlockType } from "../enums/EnumBlockType";
import { Block } from "./Block";
import { BlockInputOutput } from "./BlockInputOutput";

@InterfaceType()
export abstract class IBlock {
  @Field(() => String, {
    nullable: false,
  })
  id!: string;

  @Field(() => Date, {
    nullable: false,
  })
  createdAt!: Date;

  @Field(() => String, {
    nullable: true,
  })
  resourceId?: string;

  @Field(() => Date, {
    nullable: false,
  })
  updatedAt!: Date;

  @Field(() => Block, {
    nullable: true,
  })
  parentBlock!: Block | null;

  @Field(() => String, {
    nullable: false,
  })
  displayName!: string;

  @Field(() => String, {
    nullable: true,
  })
  description!: string;

  @Field(() => EnumBlockType, {
    nullable: false,
  })
  blockType!: keyof typeof EnumBlockType;

  @Field(() => Number, {
    nullable: false,
  })
  versionNumber!: number;

  @Field(() => [BlockInputOutput], {
    nullable: false,
  })
  inputParameters!: BlockInputOutput[];

  @Field(() => [BlockInputOutput], {
    nullable: false,
  })
  outputParameters!: BlockInputOutput[];

  @Field(() => String, {
    nullable: true,
  })
  lockedByUserId?: string;

  @Field(() => Date, {
    nullable: true,
  })
  lockedAt?: Date;
}
