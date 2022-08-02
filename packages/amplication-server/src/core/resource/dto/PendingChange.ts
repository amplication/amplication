import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EnumPendingChangeAction } from './EnumPendingChangeAction';
import { Entity } from 'src/models/Entity'; // eslint-disable-line import/no-cycle
import { Block } from 'src/models/Block'; // eslint-disable-line import/no-cycle
import { EnumPendingChangeResourceType } from './EnumPendingChangeResourceType';
import { PendingChangeResource } from './PendingChangeResource'; // eslint-disable-line import/no-cycle

@ObjectType({
  isAbstract: true
})
export class PendingChange {
  @Field(() => EnumPendingChangeAction, {
    nullable: false
  })
  action: EnumPendingChangeAction;

  @Field(() => EnumPendingChangeResourceType, {
    nullable: false
  })
  resourceType: EnumPendingChangeResourceType;

  @Field(() => String, {
    nullable: false
  })
  resourceId!: string;

  @Field(() => PendingChangeResource, {
    nullable: false
  })
  resource: Entity | Block;

  @Field(() => Int, {
    nullable: false
  })
  versionNumber!: number;
}
