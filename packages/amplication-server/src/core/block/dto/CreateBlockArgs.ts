import { BlockCreateInput } from './BlockCreateInput';

export class CreateBlockArgs<T> {
  data!: BlockCreateInput<T>;
}
