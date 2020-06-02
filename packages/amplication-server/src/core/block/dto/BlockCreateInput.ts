import { WhereParentIdInput } from 'src/dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';

export class BlockCreateInput {
  name!: string;

  description?: string;

  app!: WhereParentIdInput;

  blockType!: keyof typeof EnumBlockType;

  configuration: string;
}
