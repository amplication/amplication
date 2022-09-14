import { createUnionType } from '@nestjs/graphql';
import { Entity } from '../../../models/Entity'; // eslint-disable-line import/no-cycle
import { Block } from '../../../models/Block'; // eslint-disable-line import/no-cycle

// eslint-disable-next-line  @typescript-eslint/naming-convention
export const PendingChangeOrigin = createUnionType({
  name: 'PendingChangeOrigin',
  types: () => [Entity, Block],
  resolveType(value) {
    if (value.blockType) {
      return Block;
    }
    return Entity;
  }
});
