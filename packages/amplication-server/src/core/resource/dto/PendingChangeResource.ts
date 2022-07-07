import { createUnionType } from '@nestjs/graphql';
import { Entity } from 'src/models/Entity'; // eslint-disable-line import/no-cycle
import { Block } from 'src/models/Block'; // eslint-disable-line import/no-cycle

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
