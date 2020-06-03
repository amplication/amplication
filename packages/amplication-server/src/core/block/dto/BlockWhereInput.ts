import { WhereUniqueInput, DateTimeFilter, StringFilter } from 'src/dto';

import { EnumBlockTypeFilter } from './EnumBlockTypeFilter';

export class BlockWhereInput {
  id?: StringFilter | null;

  createdAt?: DateTimeFilter | null;

  updatedAt?: DateTimeFilter | null;

  appId?: StringFilter | null;

  blockType?: EnumBlockTypeFilter | null;

  name?: StringFilter | null;

  description?: StringFilter | null;

  // AND?: BlockWhereInput[] | null;

  // OR?: BlockWhereInput[] | null;

  // NOT?: BlockWhereInput[] | null;

  app?: WhereUniqueInput | null;
}
