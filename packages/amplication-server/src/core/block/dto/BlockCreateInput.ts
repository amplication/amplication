import { WhereParentIdInput } from 'src/dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';

export class BlockCreateInput {
  name!: string;

  description?: string;

  app!: WhereParentIdInput;

  blockType!: EnumBlockType;

  configuration: string;
}
