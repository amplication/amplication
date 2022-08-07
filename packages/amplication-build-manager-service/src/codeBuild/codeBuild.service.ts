import {
  BuildStatus,
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
import { join } from 'path';
import {
  BUILD_ARTIFACT_S3_BUCKET,
  BUILD_ARTIFACT_S3_LOCATION,
  BUILD_IMAGE_NAME,
  BUILD_IMAGE_VERSION,
  CODE_BUILD_PROJECT_NAME,
  GET_BUILD_BY_RUN_ID_TOPIC,
} from '../constants';
import { QueueService } from '../queue/queue.service';
import { timeFormatYearMonthDay } from '../utils/timeFormat';
import { BuildService } from './build.service';
import {
  BuildStateChangeDetail,
  CodeGenNotificationMessage,
} from './dto/CodeBuildNotificationMessage';

@Injectable()
export class CodeBuildService implements BuildService {
  private readonly codeBuildClient: CodeBuildClient;

  private readonly projectName: string;
  private readonly buildArtifactS3Bucket: string;
  private readonly buildArtifactS3Location: string;
  private readonly buildImageName: string;
  private readonly buildImageVersion: string;
  private readonly getBuildByRunIdTopic: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly queueService: QueueService,
  ) {
    this.codeBuildClient = new CodeBuildClient({});
    this.projectName = this.configService.get<string>(CODE_BUILD_PROJECT_NAME);
    this.buildArtifactS3Bucket = this.configService.get<string>(
      BUILD_ARTIFACT_S3_BUCKET,
    );
    this.buildArtifactS3Location = this.configService.get<string>(
      BUILD_ARTIFACT_S3_LOCATION,
    );
    this.buildImageName = this.configService.get<string>(BUILD_IMAGE_NAME);
    this.buildImageVersion =
      this.configService.get<string>(BUILD_IMAGE_VERSION);
    this.getBuildByRunIdTopic = this.configService.get<string>(
      GET_BUILD_BY_RUN_ID_TOPIC,
    );
  }

  async runBuild(
    contextPath: string,
    resourceId: string,
    buildId: string,
  ): Promise<string> {
    const artifactPath = join(
      this.buildArtifactS3Location,
      timeFormatYearMonthDay(new Date()),
      resourceId,
      buildId,
    );
    const input: StartBuildCommandInput = {
      projectName: this.projectName,
      sourceLocationOverride: contextPath,
      artifactsOverride: {
        type: 'S3',
        location: this.buildArtifactS3Bucket,
        path: artifactPath,
        name: 'artifact.zip',
        namespaceType: 'NONE',
        packaging: 'ZIP',
      },
      imageOverride: `${this.buildImageName}:${this.buildImageVersion}`,
    };

    const command = new StartBuildCommand(input);

    try {
      const response = await this.codeBuildClient.send(command);
      return response.build.arn;
    } catch (err) {
      throw new Error(
        `Failed to trigger CodeBuild job run. Input: contextArchivePath: ${contextPath}. Source error: ${err}`,
      );
    }
  }

  mapCodeBuildStatusToAmplicationBuildStatus(buildStatus: string): BuildStatus {
    switch (buildStatus) {
      case 'SUCCEEDED':
        return BuildStatus.Succeeded;
      case 'FAILED':
        return BuildStatus.Failed;
      case 'IN_PROGRESS':
        return BuildStatus.InProgress;
      case 'STOPPED':
        return BuildStatus.Stopped;
      default:
        throw new Error(`Unknown CodeBuild build status: ${buildStatus}.`);
    }
  }

  mapBuildStateMessageToBuildStatusEvent(message: string): BuildStatusEvent {
    const m: CodeGenNotificationMessage = JSON.parse(message);
    const stateChangeDetail = m.detail as BuildStateChangeDetail;

    const buildId = stateChangeDetail['build-id'];

    const buildStatus = stateChangeDetail['build-status'];
    const buildStatusEventStatus =
      this.mapCodeBuildStatusToAmplicationBuildStatus(buildStatus);

    const buildStateArtifact =
      stateChangeDetail['additional-information'].artifact;
    const artifact: FileLocation = {
      storageType: StorageTypeEnum.S3,
      path: buildStateArtifact.location,
    };

    const event: BuildStatusEvent = {
      runId: buildId,
      status: buildStatusEventStatus,
      message: m.detailType,
      timestamp: m.time,
      artifact,
    };

    return event;
  }

  async getBuild(runId: string) {
    return this.queueService.sendMessage(this.getBuildByRunIdTopic, runId);
  }
}
