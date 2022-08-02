import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EnumPendingChangeAction } from './EnumPendingChangeAction';
import { Entity } from 'src/models/Entity'; // eslint-disable-line import/no-cycle
import { Block } from 'src/models/Block'; // eslint-disable-line import/no-cycle
import { EnumPendingChangeOriginType } from './EnumPendingChangeOriginType';
import { PendingChangeOrigin } from './PendingChangeOrigin'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class PendingChange {
  @Field(() => EnumPendingChangeAction, {
    nullable: false,
    description: undefined
  })
  action: EnumPendingChangeAction;

  @Field(() => EnumPendingChangeOriginType, {
    nullable: false,
    description: undefined
  })
  originType: EnumPendingChangeOriginType;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  originId!: string;

  @Field(() => PendingChangeOrigin, {
    nullable: false,
    description: undefined
  })
  origin: Entity | Block;

  @Field(() => Int, {
    nullable: false,
    description: undefined
  })
  versionNumber!: number;
}
