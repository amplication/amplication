import { Block } from '../models';

export class BlockVersion {
  id!: string;

  createdAt!: Date;

  updatedAt!: Date;

  //block?: Block;

  versionNumber!: number;

  label!: string;

  settings?: string;

  inputParameters?: string;

  outputParameters?: string;
}
