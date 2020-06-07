import { BlockOrderByInput, BlockWhereInput } from './';

export class FindManyBlockArgs {
  where?: BlockWhereInput | null;

  orderBy?: BlockOrderByInput | null;

  skip?: number | null;

  take?: number | null;
}
