import { FileLocation } from './FileLocation';

export interface GenerateResource {
  projectId: string;
  resourceId: string;
  buildId: string;
  fileLocation: FileLocation;
}
