import { InterfaceType, Field } from '@nestjs/graphql';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { Block } from 'src/models';
import { BlockInputOutput } from './BlockInputOutput';

@InterfaceType()
export abstract class IBlock {
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
    nullable: true,
    description: undefined
  })
  parentBlock!: Block | null;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  displayName!: string;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  description!: string;

  @Field(() => EnumBlockType, {
    nullable: false,
    description: undefined
  })
  blockType!: keyof typeof EnumBlockType;

  @Field(() => Number, {
    nullable: false,
    description: undefined
  })
  versionNumber!: number;

  @Field(() => [BlockInputOutput], {
    nullable: false,
    description: undefined
  })
  inputParameters!: BlockInputOutput[];

  @Field(() => [BlockInputOutput], {
    nullable: false,
    description: undefined
  })
  outputParameters!: BlockInputOutput[];
}
