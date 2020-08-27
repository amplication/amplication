import { Field, Int, ObjectType, createUnionType } from '@nestjs/graphql';
import { EnumPendingChangeAction } from './EnumPendingChangeAction';
import { Entity } from 'src/models/Entity'; // eslint-disable-line import/no-cycle
import { Block } from 'src/models/Block'; // eslint-disable-line import/no-cycle
import { EnumPendingChangeResourceType } from './EnumPendingChangeResourceType';

// eslint-disable-next-line  @typescript-eslint/naming-convention
export const PendingChangeResource = createUnionType({
  name: 'PendingChangeResource',
  types: () => [Entity, Block],
  resolveType(value) {
    if (value.blockType) {
      return Block;
    }
    return Entity;
  }
});

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
