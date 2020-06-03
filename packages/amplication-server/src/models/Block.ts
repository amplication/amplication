import { App } from './';

export class Block {
  id!: string;

  createdAt!: Date;

  updatedAt!: Date;

  app?: App;

  name!: string;

  description?: string;

  versionNumber?: number;

  configuration?: string;

  inputParameters?: string;

  outputParameters?: string;
}
