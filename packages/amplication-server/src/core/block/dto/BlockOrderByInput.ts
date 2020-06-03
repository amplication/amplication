import { OrderByArg } from 'src/enums/OrderByArg';

export class BlockOrderByInput {
  id?: keyof typeof OrderByArg | null;

  createdAt?: keyof typeof OrderByArg | null;

  updatedAt?: keyof typeof OrderByArg | null;

  // appId?: keyof typeof OrderByArg | null;

  blockType?: keyof typeof OrderByArg | null;

  name?: keyof typeof OrderByArg | null;

  description?: keyof typeof OrderByArg | null;
}
