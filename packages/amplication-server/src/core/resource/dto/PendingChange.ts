import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EnumPendingChangeAction } from './EnumPendingChangeAction';
import { Entity } from 'src/models/Entity'; // eslint-disable-line import/no-cycle
import { Block } from 'src/models/Block'; // eslint-disable-line import/no-cycle
import { EnumPendingChangeOriginType } from './EnumPendingChangeOriginType';
import { PendingChangeOrigin } from './PendingChangeOrigin'; // eslint-disable-line import/no-cycle
import { Resource } from '../../../models';

@ObjectType({
  isAbstract: true
})
export class PendingChange {
  @Field(() => EnumPendingChangeAction, {
    nullable: false
  })
  action: EnumPendingChangeAction;

  @Field(() => EnumPendingChangeOriginType, {
    nullable: false
  })
  originType: EnumPendingChangeOriginType;

  @Field(() => String, {
    nullable: false
  })
  originId!: string;

  @Field(() => PendingChangeOrigin, {
    nullable: false
  })
  origin: Entity | Block;

  @Field(() => Int, {
    nullable: false
  })
  versionNumber!: number;

  @Field(() => Resource, { nullable: false })
  resource!: Resource;
}
