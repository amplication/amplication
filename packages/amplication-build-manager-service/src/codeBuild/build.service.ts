import { BuildStatusEvent } from '@amplication/build-types';

export interface BuildService {
  runBuild(
    contextPath: string,
    resourceId: string,
    buildId: string,
  ): Promise<string>;
  mapBuildStateMessageToBuildStatusEvent(message: string): BuildStatusEvent;
  getBuild(runId: string);
}
