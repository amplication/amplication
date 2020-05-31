import { Field, ObjectType } from '@nestjs/graphql';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { App } from '../App';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class Block {
  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  id!: string;

  @Field(_type => Date, {
    nullable: false,
    description: undefined
  })
  createdAt!: Date;

  @Field(_type => Date, {
    nullable: false,
    description: undefined
  })
  updatedAt!: Date;

  App?: App;

  @Field(_type => String, {
    nullable: false,
    description: undefined
  })
  name!: string;

  @Field(_type => String, {
    nullable: true,
    description: undefined
  })
  description?: string;

  //blockVersions?: EntityVersion[] | null;

  @Field(_type => Number, {
    nullable: true,
    description: undefined
  })
  versionNumber?: number;

  blockType!: keyof typeof EnumBlockType;
}
