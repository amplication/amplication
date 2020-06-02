import { EnumBlockType } from 'src/enums/EnumBlockType';

export class EnumBlockTypeFilter {
  equals?: typeof EnumBlockType[keyof typeof EnumBlockType] | null;

  not?: typeof EnumBlockType[keyof typeof EnumBlockType] | null;

  in?: typeof EnumBlockType[keyof typeof EnumBlockType][] | null;

  notIn?: typeof EnumBlockType[keyof typeof EnumBlockType][] | null;
}
