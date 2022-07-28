import { FileLocation } from './FileLocation';

export interface GenerateResource {
  resourceId: string;
  buildId: string;
  contextFileLocation: FileLocation;
}
