import { GithubFactory, GitProvider } from '@amplication/git-service';
import { Inject } from '@nestjs/common';
import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from '@amplication/nest-logger-module';
import { PullRequestDetailsDto } from './dto/pull-request-details.dto';
import { CommitContextDto } from './dto/commit-context.dto';
import { CommitStateDto, KafkaProducer } from '@amplication/kafka';

const BRANCH_NAME = 'amplication';

export class CommitsService {
  public static readonly CREATED_TOPIC = 'git.internal.commit-state.request.0';

  constructor(
    private githubBranchFactory: GithubFactory,
    private kafkaProducer: KafkaProducer<string, CommitStateDto>,
    @Inject(AMPLICATION_LOGGER_PROVIDER)
    private readonly logger: AmplicationLogger
  ) {}

  public async getBranch(
    gitClient: GitProvider,
    branch: string,
    context: CommitContextDto
  ): Promise<{ headCommit: string; defaultBranchName?: string }> {
    this.logger.debug(`Getting branch ${branch}`, context);

    const gitBranch = await gitClient.getBranch(branch);
    if (gitBranch) {
      this.logger.debug(
        `Branch ${branch} head commit ${gitBranch.headCommit} was found`,
        context
      );
      return {
        headCommit: gitBranch.headCommit,
      };
    }
    this.logger.warn(
      `Branch ${branch} head commit was not found creating new branch`,
      context
    );
    return this.createBranch(gitClient, branch, context);
  }

  private async createBranch(
    gitClient: GitProvider,
    branch: string,
    context: CommitContextDto
  ): Promise<{ defaultBranchName: string; headCommit: string }> {
    const defaultBranchName = await gitClient.getDefaultBranchName();
    const headCommit = (await gitClient.getBranch(defaultBranchName))
      .headCommit;
    await gitClient.createBranch(branch, headCommit);
    this.logger.info(`Branch ${branch} was created`, {
      ...context,
      repositoryMasterBranch: defaultBranchName,
      headCommit,
    });
    return {
      headCommit,
      defaultBranchName,
    };
  }

  public async getPullRequest(
    gitClient: GitProvider,
    branch: string,
    message: string,
    baseBranchName: string | undefined,
    context: CommitContextDto
  ): Promise<PullRequestDetailsDto> {
    this.logger.debug(`Getting pull request for branch ${branch}`, {
      ...context,
      branch,
    });
    let pullRequest = await gitClient.getOpenedPullRequest(branch);
    const created = !pullRequest;
    if (!pullRequest) {
      this.logger.debug(
        `Branch ${branch} does not have an open pull request - creating new pull request`,
        {
          ...context,
          branch,
        }
      );
      pullRequest = await gitClient.createPullRequest(
        'Amplication Resent Changes',
        message,
        branch,
        baseBranchName || (await gitClient.getDefaultBranchName())
      );
      this.logger.info('Opened new pull request', {
        ...context,
        branch,
      });
    }
    return {
      ...pullRequest,
      created,
    };
  }

  public async addCommitToRepository(
    installationId: string,
    context: CommitContextDto,
    message: string,
    files: { path: string; content: string | null }[]
  ): Promise<string> {
    const gitClient = await this.githubBranchFactory.getClient(
      installationId,
      context.owner,
      context.repo
    );

    const branch = await this.getBranch(gitClient, BRANCH_NAME, context);
    await this.kafkaProducer.emit(
      CommitsService.CREATED_TOPIC,
      context.buildId,
      new CommitStateDto(
        context.resourceId,
        context.actionStepId,
        'got amplication branch',
        'Running'
      )
    );

    const commit = await this.createCommit(
      gitClient,
      BRANCH_NAME,
      branch.headCommit,
      message,
      files,
      context
    );
    await this.kafkaProducer.emit(
      CommitsService.CREATED_TOPIC,
      context.buildId,
      new CommitStateDto(
        context.resourceId,
        context.actionStepId,
        `created new commit - commit sha ${commit.sha}`,
        'Running'
      )
    );

    const pullRequest = await this.getPullRequest(
      gitClient,
      BRANCH_NAME,
      message,
      branch.defaultBranchName,
      context
    );

    if (pullRequest.created) {
      await this.kafkaProducer.emit(
        CommitsService.CREATED_TOPIC,
        context.buildId,
        new CommitStateDto(
          context.resourceId,
          context.actionStepId,
          `Opened pull request #${pullRequest.number}: ${pullRequest.url}`,
          'Running',
          {
            githubUrl: pullRequest.url,
          }
        )
      );
    } else {
      await this.kafkaProducer.emit(
        CommitsService.CREATED_TOPIC,
        context.buildId,
        new CommitStateDto(
          context.resourceId,
          context.actionStepId,
          `Updated pull request #${pullRequest.number}: ${pullRequest.url}`,
          'Running',
          {
            githubUrl: pullRequest.url,
          }
        )
      );
    }

    const commentUrl = await this.addCommentToPullRequest(
      gitClient,
      message,
      pullRequest,
      context
    );
    await this.kafkaProducer.emit(
      CommitsService.CREATED_TOPIC,
      context.buildId,
      new CommitStateDto(
        context.resourceId,
        context.actionStepId,
        `Add new comment to pull request #${pullRequest.number} ${commentUrl}`,
        'Running',
        {
          commentUrl,
        }
      )
    );

    return commit.sha;
  }

  public async createCommit(
    gitClient: GitProvider,
    branch: string,
    headCommit: string,
    message: string,
    files: { path: string; content: string | null }[],
    context: CommitContextDto
  ) {
    this.logger.info(
      `Creating commit on branch ${branch} commit parent commit ${headCommit}`,
      {
        ...context,
        branch,
        files: files.length,
        commitParent: headCommit,
      }
    );
    const commitSha = await gitClient.commit(
      branch,
      message,
      files.map(file=>({path:file.path.startsWith("/") ? file.path.substring(1) : file.path,content:file.content})),
      headCommit
    );

    return {
      sha: commitSha,
      timestamp: new Date().toISOString(),
    };
  }

  public async addCommentToPullRequest(
    gitClient: GitProvider,
    message: string,
    pullRequest: PullRequestDetailsDto,
    context: CommitContextDto
  ): Promise<string> {
    this.logger.info(
      `Adding comment to pull request ${pullRequest.number}`,
      context
    );
    return await gitClient.addPullRequestComment(
      pullRequest.number,
      `##Commit added to pull request 
            Commit ID:${context.commitId}
            Build ID:${context.buildId}
            Resource: ${context.resourceName} (${context.resourceId})
            
            message: ${message}`
    );
  }
}
