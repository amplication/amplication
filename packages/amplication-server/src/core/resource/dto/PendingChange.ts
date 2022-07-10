import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EnumPendingChangeAction } from './EnumPendingChangeAction';
import { Entity } from 'src/models/Entity'; // eslint-disable-line import/no-cycle
import { Block } from 'src/models/Block'; // eslint-disable-line import/no-cycle
import { EnumPendingChangeResourceType } from './EnumPendingChangeResourceType';
import { PendingChangeResource } from './PendingChangeResource'; // eslint-disable-line import/no-cycle

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

  @Field(() => EnumPendingChangeResourceType, {
    nullable: false,
    description: undefined
  })
  resourceType: EnumPendingChangeResourceType;

  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  resourceId!: string;

  @Field(() => PendingChangeResource, {
    nullable: false,
    description: undefined
  })
  resource: Entity | Block;

  @Field(() => Int, {
    nullable: false,
    description: undefined
  })
  versionNumber!: number;
}
