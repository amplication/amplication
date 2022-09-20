import {Controller, Inject, OnModuleInit} from '@nestjs/common';
import { CommitsService } from './commits.service';
import {
  AMPLICATION_LOGGER_PROVIDER,
  AmplicationLogger,
} from '@amplication/nest-logger-module';
import { CommitContextDto } from './dto/commit-context.dto';
import { DiffService } from '../diff';
import { PrModule } from '../../constants';
import {
  CommitStateDto,
  GitCommitInitiatedDto,
  KafkaConsumer,
  KafkaMessageDto,
  KafkaProducer,
} from '@amplication/kafka';
import {CommitTopicsConfigDto} from "./dto/commit-topics-config-dto.service";


@Controller()
export class CommitController implements OnModuleInit {

  constructor(
    private config: CommitTopicsConfigDto,
    private kafkaConsumer: KafkaConsumer<string, GitCommitInitiatedDto>,
    private kafkaProducer: KafkaProducer<string, CommitStateDto>,
    private commitService: CommitsService,
    private diffService: DiffService,
    @Inject(AMPLICATION_LOGGER_PROVIDER) private logger: AmplicationLogger
  ) {}

  async onModuleInit(): Promise<any> {
    this.logger.info(
        `CommitController - subscribing to topic: ${this.config.commitInitiatedTopic}`
    );
    await this.kafkaConsumer.subscribe(this.config.commitInitiatedTopic, this.handleCommit);
  }

  handleCommit = async (
    kafkaMessage: KafkaMessageDto<string, GitCommitInitiatedDto>
  ): Promise<void> => {
    try {
      this.logger.info('CommitController - received message from topic', {
        ...kafkaMessage,
      });
      const eventData = kafkaMessage.value;

      this.logger.info('get changed files from last build', {
        ...eventData,
      });
      const changedFiles: PrModule[] =
        await this.diffService.listOfChangedFiles(
          eventData.build.resourceId,
          eventData.build.previousBuildId,
          eventData.build.id
        );
      this.logger.info(
        'The changed files has return from the diff service listOfChangedFiles',
        {
          ...eventData,
          lengthOfFile: changedFiles.length,
        }
      );

      const commitContext: CommitContextDto =
        CommitController.createCommitContext(eventData);

      const commitSha: string = await this.commitService.addCommitToRepository(
        eventData.repository.installationId,
        commitContext,
        eventData.commit.message,
        changedFiles.map(({ path, code }) => ({
          path,
          content: code,
        }))
      );

      await this.kafkaProducer.emit(
        this.config.commitCommitState,
        commitContext.buildId,
        new CommitStateDto(
          eventData.build.resourceId,
          eventData.build.actionStepId,
          `Commit ${commitSha} pushed successfully to ${eventData.repository.owner}/${eventData.repository.name}`,
          'Success',
          {
            commitSha,
          }
        )
      );
    } catch (error) {
      await this.kafkaProducer.emit(
        this.config.commitCommitState,
        kafkaMessage.value.build.id,
        new CommitStateDto(
          kafkaMessage.value.build.resourceId,
          kafkaMessage.value.build.actionStepId,
          error.message,
          'Failed'
        )
      );
    }
  }

  private static createCommitContext(
    value: GitCommitInitiatedDto
  ): CommitContextDto {
    return {
      owner: value.repository.owner,
      commitId: value.commit.id,
      repo: value.repository.name,
      resourceName: value.build.resourceId,
      resourceId: value.build.resourceId,
      buildId: value.build.id,
      actionStepId: value.build.actionStepId,
    };
  }
}
