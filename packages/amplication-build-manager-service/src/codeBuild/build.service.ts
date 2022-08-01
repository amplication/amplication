import { BuildStatusEvent } from '@amplication/build-types';

export interface BuildService {
  runBuild(contextArchivePath: string);
  mapBuildStateMessageToBuildStatusEvent(message: string): BuildStatusEvent;
}
