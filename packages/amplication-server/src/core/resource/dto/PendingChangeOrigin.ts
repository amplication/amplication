import { Block } from "../../../models/Block";
import { Entity } from "../../../models/Entity";
import { createUnionType } from "@nestjs/graphql";

// eslint-disable-next-line  @typescript-eslint/naming-convention
export const PendingChangeOrigin = createUnionType({
  name: "PendingChangeOrigin",
  types: () => [Entity, Block],
  resolveType(value) {
    if (value.blockType) {
      return Block;
    }
    return Entity;
  },
});
