import { BuildStatusEvent } from '@amplication/build-types';

export interface BuildService {
  runBuild(contextArchivePath: string);
  mapBuildPhaseMessageToBuildStatusEvent(message: string): BuildStatusEvent;
  mapBuildStateMessageToBuildStatusEvent(message: string): BuildStatusEvent;
}
