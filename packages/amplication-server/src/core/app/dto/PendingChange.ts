import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EnumPendingChangeType } from './EnumPendingChangeType';
import { User } from 'src/models/User'; // eslint-disable-line import/no-cycle
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { EnumPendingChangeObjectType } from './EnumPendingChangeObjectType';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class PendingChange {
  @Field(() => EnumPendingChangeType, {
    nullable: false,
    description: undefined
  })
  changeType: EnumPendingChangeType;

  @Field(() => EnumPendingChangeObjectType, {
    nullable: false,
    description: undefined
  })
  objectType: EnumPendingChangeObjectType;

  @Field(() => EnumBlockType, {
    nullable: true,
    description: undefined
  })
  blockType?: EnumBlockType;

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

  @Field(() => User, {
    nullable: true,
    description: undefined
  })
  lockedByUser?: User;

  @Field(() => Date, {
    nullable: true,
    description: undefined
  })
  lockedAt?: Date;

  @Field(() => Int, {
    nullable: false,
    description: undefined
  })
  versionNumber!: number;
}
