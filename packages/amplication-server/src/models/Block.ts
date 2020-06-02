import { App } from './';
import { EnumBlockType } from 'src/enums/EnumBlockType';

export class Block {
  id!: string;

  createdAt!: Date;

  updatedAt!: Date;

  app?: App;

  appId: string;

  name!: string;

  description?: string;

  blockType: keyof typeof EnumBlockType;

  versionNumber?: number;

  configuration?: string;

  inputParameters?: string;

  outputParameters?: string;
}
