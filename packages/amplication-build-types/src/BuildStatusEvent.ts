import { BuildStatus } from './BuildStatus';
import { FileLocation } from './FileLocation';

export interface BuildStatusEvent {
  buildId?: string;
  runId?: string;
  status: BuildStatus;
  message: string;
  timestamp: string;
  artifact?: FileLocation;
}
