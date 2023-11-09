import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DSGResourceData } from "@amplication/code-gen-types";
import axios from "axios";
import { promises as fs } from "fs";
import { copy } from "fs-extra";
import { join, dirname } from "path";
import { Env } from "../env";
import { Traceable } from "@amplication/opentelemetry-nestjs";
import { CodeGeneratorSplitterService } from "../code-generator/code-generator-splitter.service";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import {
  CodeGenerationFailure,
  CodeGenerationSuccess,
  KAFKA_TOPICS,
} from "@amplication/schema-registry";
import { EnumEventStatus } from "../types";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";

@Traceable()
@Injectable()
export class BuildRunnerService {
  constructor(
    private readonly configService: ConfigService<Env, true>,
    private readonly producerService: KafkaProducerService,
    private readonly codeGeneratorService: CodeGeneratorService,
    private readonly codeGeneratorSplitterService: CodeGeneratorSplitterService,
    private readonly logger: AmplicationLogger
  ) {}

  async runJobs(
    resourceId: string,
    buildId: string,
    dsgResourceData: DSGResourceData
  ) {
    try {
      const codeGeneratorVersion =
        await this.codeGeneratorService.getCodeGeneratorVersion({
          codeGeneratorVersion:
            dsgResourceData.resourceInfo.codeGeneratorVersionOptions
              .codeGeneratorVersion,
          codeGeneratorStrategy:
            dsgResourceData.resourceInfo.codeGeneratorVersionOptions
              .codeGeneratorStrategy,
        });

      const jobs = await this.codeGeneratorSplitterService.splitJobs(
        dsgResourceData,
        buildId
      );
      for (const [domainName, data] of jobs) {
        const jobBuildId = `${buildId}-${domainName}`;
        this.logger.debug("Running job for...", { domainName, buildId });
        await this.saveDsgResourceData(jobBuildId, data, codeGeneratorVersion);

        const url = this.configService.get(Env.DSG_RUNNER_URL);
        try {
          await axios.post(url, {
            resourceId: resourceId,
            buildId: jobBuildId,
            codeGeneratorVersion,
          });
        } catch (error) {
          throw new Error(error.message, {
            cause: {
              code: error.response?.status,
              message: error.response?.data?.message,
              data: error.config?.data,
            },
          });
        }
      }
    } catch (error) {
      this.logger.error(error.message, error);
      await this.emitCodeGenerationFailureEvent(buildId, error);
    }
  }

  /**
   * Emits a kafka event based on the job status (success / failure) from the redis cache
   * @param resourceId the resource id
   * @param buildId the original buildId without the suffix (domain name)
   * @param codeGeneratorVersion the code generator version
   */
  async emitKafkaEventBasedOnJobStatus(
    resourceId: string,
    buildIdWithDomainName: string
  ) {
    const buildId = this.codeGeneratorSplitterService.extractBuildId(
      buildIdWithDomainName
    );
    const codeGeneratorVersion = await this.getCodeGeneratorVersion(
      buildIdWithDomainName
    );
    try {
      const [domainName, isSuccess] = await this.copyFromJobToArtifact(
        resourceId,
        buildIdWithDomainName
      );

      await this.codeGeneratorSplitterService.setJobStatusBasedOnArtifact(
        domainName,
        isSuccess,
        buildId
      );

      const jobStatus = await this.codeGeneratorSplitterService.getJobStatus(
        buildId
      );

      if (jobStatus === EnumEventStatus.Success) {
        await this.emitCodeGenerationSuccessEvent({
          buildId,
          codeGeneratorVersion,
        });
      } else {
        await this.emitCodeGenerationFailureEvent(
          buildId,
          new Error(`Code generation failed for ${domainName}`)
        );
      }
    } catch (error) {
      this.logger.error(error.message, error);
      await this.emitCodeGenerationFailureEvent(buildId, error);
    }
  }

  async emitCodeGenerationSuccessEvent(
    codeGenerationSuccess: CodeGenerationSuccess.Value
  ) {
    try {
      const successEvent: CodeGenerationSuccess.KafkaEvent = {
        key: null,
        value: codeGenerationSuccess,
      };

      await this.producerService.emitMessage(
        KAFKA_TOPICS.CODE_GENERATION_SUCCESS_TOPIC,
        successEvent
      );
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  async emitCodeGenerationFailureEvent(
    buildIdWithDomainName: string,
    error: Error
  ) {
    try {
      const buildId = this.codeGeneratorSplitterService.extractBuildId(
        buildIdWithDomainName
      );

      const codeGeneratorVersion = await this.getCodeGeneratorVersion(
        buildIdWithDomainName
      );

      const failureEvent: CodeGenerationFailure.KafkaEvent = {
        key: null,
        value: { buildId, codeGeneratorVersion, error },
      };

      await this.producerService.emitMessage(
        KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
        failureEvent
      );
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }

  async saveDsgResourceData(
    buildId: string,
    dsgResourceData: DSGResourceData,
    codeGeneratorVersion: string
  ) {
    const savePath = join(
      this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
      buildId,
      this.configService.get(Env.DSG_JOBS_RESOURCE_DATA_FILE)
    );

    const saveDir = dirname(savePath);
    await fs.mkdir(saveDir, { recursive: true });

    await fs.writeFile(
      savePath,
      JSON.stringify({ ...dsgResourceData, codeGeneratorVersion })
    );
  }

  async getCodeGeneratorVersion(buildId: string) {
    const data = await fs.readFile(
      join(
        this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
        buildId,
        this.configService.get(Env.DSG_JOBS_RESOURCE_DATA_FILE)
      )
    );

    const config = <DSGResourceData & { codeGeneratorVersion: string }>(
      JSON.parse(data.toString())
    );

    return config.codeGeneratorVersion;
  }

  async copyFromJobToArtifact(
    resourceId: string,
    buildIdWithDomainName: string
  ): Promise<[string, boolean]> {
    const domainName = this.codeGeneratorSplitterService.extractDomainName(
      buildIdWithDomainName
    );
    const buildId = this.codeGeneratorSplitterService.extractBuildId(
      buildIdWithDomainName
    );

    try {
      const jobPath = join(
        this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
        buildIdWithDomainName,
        this.configService.get(Env.DSG_JOBS_CODE_FOLDER)
      );

      const artifactPath = join(
        this.configService.get(Env.BUILD_ARTIFACTS_BASE_FOLDER),
        resourceId,
        buildId
      );

      await copy(jobPath, artifactPath);
      return [domainName, true];
      return;
    } catch (error) {
      return [domainName, false];
    }
  }
}
