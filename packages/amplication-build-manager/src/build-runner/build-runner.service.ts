import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DSGResourceData } from "@amplication/code-gen-types";
import axios from "axios";
import { promises as fs } from "fs";
import { copy, exists } from "fs-extra";
import { join, dirname } from "path";
import { Env } from "../env";
import { Traceable } from "@amplication/opentelemetry-nestjs";
import { BuildJobsHandlerService } from "../build-job-handler/build-job-handler.service";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import {
  CodeGenerationFailure,
  CodeGenerationSuccess,
  KAFKA_TOPICS,
  PackageManagerCreateFailure,
  PackageManagerCreateRequest,
  PackageManagerCreateSuccess,
} from "@amplication/schema-registry";
import { CodeGenerationRequest, EnumDomainName, EnumJobStatus } from "../types";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { CodeGeneratorService } from "../code-generator/code-generator-catalog.service";
import { CodeGenerationFailureDto } from "./dto/CodeGenerationFailure";
import { CodeGenerationSuccessDto } from "./dto/CodeGenerationSuccess";

const OLD_DSG_IMAGE_NAME = "data-service-generator";

@Traceable()
@Injectable()
export class BuildRunnerService {
  constructor(
    private readonly configService: ConfigService<Env, true>,
    private readonly producerService: KafkaProducerService,
    private readonly codeGeneratorService: CodeGeneratorService,
    private readonly buildJobsHandlerService: BuildJobsHandlerService,
    private readonly logger: AmplicationLogger
  ) {}

  async onPackageManagerCreateSuccess(
    response: PackageManagerCreateSuccess.Value
  ) {
    await this.codeGenerationAndPackagesCompleted(response.buildId);
  }

  async onPackageManagerCreateFailure(
    response: PackageManagerCreateFailure.Value
  ) {
    return this.emitCodeGenerationFailureWhenJobStatusFailed(
      response.buildId,
      new Error(response.errorMessage)
    );
  }

  async generatePackages(
    buildId: string,
    resourceId: string,
    dsgResourceData: DSGResourceData
  ) {
    const requestPackagesEvent: PackageManagerCreateRequest.KafkaEvent = {
      key: null,
      value: { resourceId: resourceId, buildId: buildId, dsgResourceData },
    };
    await this.producerService.emitMessage(
      KAFKA_TOPICS.PACKAGE_MANAGER_CREATE_REQUEST,
      requestPackagesEvent
    );
  }

  /// this function accepts either the buildId or the jobBuildId
  /// This method is called when the code generation and the packages generation are completed
  /// It emits a kafka event with the buildId and the code generator version
  async codeGenerationAndPackagesCompleted(buildIdOrJobBuildId: string) {
    const codeGeneratorVersion = await this.getCodeGeneratorVersion(
      buildIdOrJobBuildId
    );

    const buildId =
      this.buildJobsHandlerService.extractBuildId(buildIdOrJobBuildId);

    const successEvent: CodeGenerationSuccess.KafkaEvent = {
      key: null,
      value: { buildId, codeGeneratorVersion },
    };

    this.logger.info("emit code generation success event", successEvent);
    await this.producerService.emitMessage(
      KAFKA_TOPICS.CODE_GENERATION_SUCCESS_TOPIC,
      successEvent
    );
  }

  async runBuild(
    resourceId: string,
    buildId: string,
    dsgResourceData: DSGResourceData
  ) {
    let codeGeneratorVersion: string;
    const codeGeneratorFullName =
      await this.codeGeneratorNameToContainerImageName(
        dsgResourceData.resourceInfo.codeGeneratorName
      );
    try {
      codeGeneratorVersion =
        await this.codeGeneratorService.getCodeGeneratorVersion({
          codeGeneratorFullName,
          codeGeneratorVersion:
            dsgResourceData.resourceInfo.codeGeneratorVersionOptions
              .codeGeneratorVersion,
          codeGeneratorStrategy:
            dsgResourceData.resourceInfo.codeGeneratorVersionOptions
              .codeGeneratorStrategy,
        });

      this.logger.debug("Code Generator settings: ", {
        codeGeneratorVersion,
        codeGeneratorName: dsgResourceData.resourceInfo.codeGeneratorName,
        codeGeneratorFullName,
      });

      const jobs = await this.buildJobsHandlerService.splitBuildsIntoJobs(
        dsgResourceData,
        buildId,
        codeGeneratorVersion
      );
      for (const [jobBuildId, data] of jobs) {
        this.logger.debug("Running job for...", { jobBuildId });
        await this.runJob(
          resourceId,
          jobBuildId,
          data,
          codeGeneratorVersion,
          codeGeneratorFullName,
          buildId
        );
      }
    } catch (error) {
      this.logger.error(error.message, error);
      const failureEvent: CodeGenerationFailure.KafkaEvent = {
        key: null,
        value: { buildId, codeGeneratorVersion, error },
      };

      await this.producerService.emitMessage(
        KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
        failureEvent
      );
    }
  }

  async runJob(
    resourceId: string,
    jobBuildId: string,
    data: DSGResourceData,
    codeGeneratorVersion: string,
    codeGeneratorFullName: string,
    plainBuildId: string
  ) {
    try {
      await this.saveDsgResourceData(jobBuildId, data, codeGeneratorVersion);
      await this.saveRelevantDsgAssets(resourceId, jobBuildId, plainBuildId);

      const url = this.configService.get(Env.DSG_RUNNER_URL);

      const postBody: CodeGenerationRequest = {
        resourceId,
        buildId: jobBuildId,
        codeGeneratorVersion, // image tag. Nullable. If not provided, the default image tag for each environment will be used
        codeGeneratorName: codeGeneratorFullName, // image (and container) name. Nullable. If not provided, the default image name will be used (data-service-generator)
      };
      this.logger.debug("Calling argo event with post payload: ", { postBody });
      await axios.post(url, postBody);
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

  onCodeGenerationFailure(response: CodeGenerationFailureDto) {
    return this.emitCodeGenerationFailureWhenJobStatusFailed(
      response.buildId,
      response.error
    );
  }

  onCodeGenerationSuccess(response: CodeGenerationSuccessDto) {
    return this.handleDsgJobCompleted(response.resourceId, response.buildId);
  }

  /**
   * Emits a kafka event based on the job status (success / failure) from the redis cache
   * @param resourceId the resource id
   * @param buildId the original buildId without the suffix (domain name)
   * @param codeGeneratorVersion the code generator version
   */
  async handleDsgJobCompleted(resourceId: string, jobBuildId: string) {
    let codeGeneratorVersion: string;
    const buildId = this.buildJobsHandlerService.extractBuildId(jobBuildId);
    let otherJobsHaveNotFailed = true;

    try {
      codeGeneratorVersion = await this.getCodeGeneratorVersion(jobBuildId);

      const currentBuildStatus =
        await this.buildJobsHandlerService.getBuildStatus(buildId);
      otherJobsHaveNotFailed = currentBuildStatus !== EnumJobStatus.Failure;

      await this.copyFromJobToArtifact(resourceId, jobBuildId);

      await this.buildJobsHandlerService.setJobStatus(
        jobBuildId,
        EnumJobStatus.Success
      );

      const buildStatus = await this.buildJobsHandlerService.getBuildStatus(
        buildId
      );

      if (buildStatus === EnumJobStatus.InProgress) {
        // do nothing
        return;
      }

      if (buildStatus === EnumJobStatus.Success) {
        const dsgResourceData =
          await this.buildJobsHandlerService.extractDsgResourceData(jobBuildId);

        const enablePackageManager = Boolean(
          this.configService.get<string>(Env.ENABLE_PACKAGE_MANAGER) === "true"
        );

        //package manager is called only after all the jobs are completed
        if (dsgResourceData.packages?.length > 0 && enablePackageManager) {
          await this.generatePackages(buildId, resourceId, dsgResourceData);
        } else {
          this.logger.info("No packages to generate - complete build");
          await this.codeGenerationAndPackagesCompleted(jobBuildId);
        }
      }
    } catch (error) {
      this.logger.error(error.message, error);

      if (otherJobsHaveNotFailed) {
        const failureEvent: CodeGenerationFailure.KafkaEvent = {
          key: null,
          value: {
            buildId,
            codeGeneratorVersion,
            error,
          },
        };

        await this.producerService.emitMessage(
          KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
          failureEvent
        );
      }
    }
  }

  async emitCodeGenerationFailureWhenJobStatusFailed(
    jobBuildId: string,
    jobError: Error
  ) {
    let codeGeneratorVersion: string;
    let otherJobsHaveNotFailed = true;

    const buildId = this.buildJobsHandlerService.extractBuildId(jobBuildId);
    try {
      codeGeneratorVersion = await this.getCodeGeneratorVersion(jobBuildId);

      const currentBuildStatus =
        await this.buildJobsHandlerService.getBuildStatus(buildId);
      otherJobsHaveNotFailed = currentBuildStatus !== EnumJobStatus.Failure;

      await this.buildJobsHandlerService.setJobStatus(
        jobBuildId,
        EnumJobStatus.Failure
      );
    } catch (error) {
      this.logger.error(error.message, error, { causeError: jobError });
    } finally {
      if (otherJobsHaveNotFailed) {
        const failureEvent: CodeGenerationFailure.KafkaEvent = {
          key: null,
          value: { buildId, codeGeneratorVersion, error: jobError },
        };

        await this.producerService.emitMessage(
          KAFKA_TOPICS.CODE_GENERATION_FAILURE_TOPIC,
          failureEvent
        );
      }
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

  async saveRelevantDsgAssets(
    resourceId: string,
    buildId: string,
    plainBuildId: string
  ) {
    const dsgAssetsPathForBuild = join(
      this.configService.get(Env.DSG_ASSETS_FOLDER),
      `${resourceId}-${plainBuildId}`
    );

    if (!(await exists(dsgAssetsPathForBuild))) {
      return;
    }

    const jobPathForDsgAssets = join(
      this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
      buildId,
      "dsg-assets"
    );

    await copy(dsgAssetsPathForBuild, jobPathForDsgAssets);
  }

  async getCodeGeneratorVersion(buildId: string) {
    let resourceDataFilePath = join(
      this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
      buildId,
      this.configService.get(Env.DSG_JOBS_RESOURCE_DATA_FILE)
    );

    if (!(await exists(resourceDataFilePath))) {
      this.logger.debug(
        "Resource data file not found, looking for the file in the 'server' job folder",
        {
          resourceDataFilePath,
        }
      );
      resourceDataFilePath = join(
        this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
        this.buildJobsHandlerService.generateJobBuildId(
          buildId,
          EnumDomainName.Server
        ),
        this.configService.get(Env.DSG_JOBS_RESOURCE_DATA_FILE)
      );
    }

    if (!(await exists(resourceDataFilePath))) {
      this.logger.error(
        `Resource data file not found for buildId: ${buildId}. using empty string as code generator version.`
      );
      return "";
    }

    const data = await fs.readFile(resourceDataFilePath);

    const config = <DSGResourceData & { codeGeneratorVersion: string }>(
      JSON.parse(data.toString())
    );

    return config.codeGeneratorVersion;
  }

  async copyFromJobToArtifact(
    resourceId: string,
    jobBuildId: string
  ): Promise<void> {
    const buildId = this.buildJobsHandlerService.extractBuildId(jobBuildId);

    try {
      const jobPath = join(
        this.configService.get(Env.DSG_JOBS_BASE_FOLDER),
        jobBuildId,
        this.configService.get(Env.DSG_JOBS_CODE_FOLDER)
      );

      const artifactPath = join(
        this.configService.get(Env.BUILD_ARTIFACTS_BASE_FOLDER),
        resourceId,
        buildId
      );

      await copy(jobPath, artifactPath);
    } catch (error) {
      this.logger.error(error.message, error);
      throw error;
    }
  }

  /**
   *
   * @param codeGeneratorVersion (string) the requested code generator version
   * @param codeGeneratorName (string) the requested code generator name (from the DSG catalog).
   * If didn't provided, the old image name will be used
   * @returns (string) the container image name
   */
  private async codeGeneratorNameToContainerImageName(
    codeGeneratorName: string
  ): Promise<string> {
    if (!codeGeneratorName) {
      this.logger.debug("Using default image name", {
        name: OLD_DSG_IMAGE_NAME,
      });

      return OLD_DSG_IMAGE_NAME;
    }

    this.logger.debug("Using image name from the DSG catalog", {
      name: codeGeneratorName,
    });

    return this.codeGeneratorService.getCodeGenerators(codeGeneratorName);
  }
}
