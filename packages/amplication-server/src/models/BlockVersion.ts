import { Block } from '../models';

export class BlockVersion {
  id!: string;

  createdAt!: Date;

  updatedAt!: Date;

  block?: Block;

  versionNumber!: number;

  label!: string;

  configuration?: string;

  inputParameters?: string;

  outputParameters?: string;
}
