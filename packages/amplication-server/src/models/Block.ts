import { Field, ObjectType } from '@nestjs/graphql';
import { App } from './';
import { EnumBlockType } from 'src/enums/EnumBlockType';

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

  appId: string;

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

  // @Field(() => EnumBlockType, {
  //   nullable: false,
  //   description: undefined
  // })
  blockType: keyof typeof EnumBlockType;

  @Field(() => Number, {
    nullable: true,
    description: undefined
  })
  versionNumber?: number;

  settings?: T;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  inputParameters?: string;

  @Field(() => String, {
    nullable: true,
    description: undefined
  })
  outputParameters?: string;
}
