export class GitCommitInitiatedDto {
  constructor(public commit: { id: string, message: string },
              public build: { id: string, actionStepId: string, resourceId: string, previousBuildId: string },
              public repository: { owner: string, name: string, installationId: string }) {
  }

}