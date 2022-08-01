import {
  BuildStatusEnum,
  BuildStatusEvent,
  FileLocation,
  StorageTypeEnum,
} from '@amplication/build-types';
import {
  CodeBuildClient,
  StartBuildCommand,
  StartBuildCommandInput,
} from '@aws-sdk/client-codebuild';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CODE_BUILD_PROJECT_NAME } from 'src/constants';
import { BuildService } from './build.service';
import {
  BuildPhaseChangeDetail,
  BuildStateChangeDetail,
  CodeGenNotificationMessage,
} from './dto/CodeBuildNotificationMessage';

@Injectable()
export class CodeBuildService implements BuildService {
  private readonly codeBuildClient: CodeBuildClient;
  private readonly projectName: string;

  constructor(private readonly configService: ConfigService) {
    this.codeBuildClient = new CodeBuildClient({});
    this.projectName = this.configService.get<string>(CODE_BUILD_PROJECT_NAME);
  }

  runBuild(contextArchivePath: string) {
    const input: StartBuildCommandInput = {
      projectName: this.projectName,
      sourceLocationOverride: contextArchivePath,
    };

    const command = new StartBuildCommand(input);

    try {
      return this.codeBuildClient.send(command);
    } catch (err) {
      throw new Error(
        `Failed to trigger CodeBuild job run. Input: contextArchivePath: ${contextArchivePath}. Source error: ${err}`,
      );
    }
  }

  mapBuildPhaseMessageToBuildStatusEvent(message: string): BuildStatusEvent {
    const m: CodeGenNotificationMessage = JSON.parse(message);
    const phaseChangeDetail = m.detail as BuildPhaseChangeDetail;

    const buildId = phaseChangeDetail['build-id'];

    const buildIdParts = buildId.split(':');
    const runId = buildIdParts[buildIdParts.length - 1];

    const buildStatus = phaseChangeDetail['completed-phase-status'];
    const buildStatusEventStatus = buildStatus as BuildStatusEnum;

    const buildStateArtifact =
      phaseChangeDetail['additional-information'].artifact;
    const artifact: FileLocation = {
      storageType: StorageTypeEnum.S3,
      path: buildStateArtifact.location,
    };

    const event: BuildStatusEvent = {
      buildId,
      runId,
      status: buildStatusEventStatus,
      message: message,
      timestamp: m.time.toISOString(),
      artifact,
    };

    return event;
  }

  mapBuildStateMessageToBuildStatusEvent(message: string): BuildStatusEvent {
    const m: CodeGenNotificationMessage = JSON.parse(message);
    const stateChangeDetail = m.detail as BuildStateChangeDetail;

    const buildId = stateChangeDetail['build-id'];

    const buildIdParts = buildId.split(':');
    const runId = buildIdParts[buildIdParts.length - 1];

    const buildStatus = stateChangeDetail['build-status'];
    const buildStatusEventStatus = buildStatus as BuildStatusEnum;

    const buildStateArtifact =
      stateChangeDetail['additional-information'].artifact;
    const artifact: FileLocation = {
      storageType: StorageTypeEnum.S3,
      path: buildStateArtifact.location,
    };

    const event: BuildStatusEvent = {
      buildId,
      runId,
      status: buildStatusEventStatus,
      message,
      timestamp: m.time.toISOString(),
      artifact,
    };

    return event;
  }
}
