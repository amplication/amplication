import { Entity } from 'src/models';

export type AppGenerationRequest = {
  id: string;
  entities: Entity[];
};
