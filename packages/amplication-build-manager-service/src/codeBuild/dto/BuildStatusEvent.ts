import { BuildStatusEnum } from './BuildStatusEnum';
import { FileLocation } from './FileLocation';

export interface BuildStatusEvent {
  buildId?: string;
  runId: string;
  status: BuildStatusEnum;
  message: string;
  timestamp: string;
  artifact?: FileLocation;
}
