import { Octokit } from 'octokit';
import { GitProvider } from './git-provider.interface';
import { PullRequestMeta } from '../Dto/entities/pull-request-meta.dto';

export class GithubProvider implements GitProvider {
  constructor(
    private octokit: Octokit,
    private owner: string,
    private repo: string
  ) {}

  private static async createFilesTree(
    octokit: Octokit,
    owner: string,
    repo: string,
    latestCommitSha: string,
    files: { path: string; content: string }[]
  ): Promise<string> {
    return (
      await octokit.rest.git.createTree({
        owner,
        repo,
        tree: files.map(file => ({
            ...file,
            type: 'blob',
            mode: '100644'
        })),
        base_tree: latestCommitSha
      })
    ).data.sha;
  }

  private static async createCommit(
    octokit: Octokit,
    owner: string,
    repo: string,
    message: string,
    latestCommitSha: string,
    fileTreeSha: string
  ): Promise<string> {
    return (
      await octokit.rest.git.createCommit({
        owner,
        repo,
        message,
        tree: fileTreeSha,
        parents: [latestCommitSha]
      })
    ).data.sha;
  }

  private static async updateRef(
    octokit: Octokit,
    owner: string,
    repo: string,
    branch: string,
    commitSha: string
  ): Promise<string> {
    return (
      await octokit.rest.git.updateRef({
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: commitSha
      })
    ).data.url;
  }

  public async commit(
    branch: string,
    message: string,
    files: { path: string; content: string }[],
    headCommit: string
  ): Promise<string> {
    const fileTreeSha = await GithubProvider.createFilesTree(
      this.octokit,
      this.owner,
      this.repo,
      headCommit,
      files
    );
    const commitSha = await GithubProvider.createCommit(
      this.octokit,
      this.owner,
      this.repo,
      message,
      headCommit,
      fileTreeSha
    );
    await GithubProvider.updateRef(
      this.octokit,
      this.owner,
      this.repo,
      branch,
      commitSha
    );
    return commitSha;
  }

  public async createPullRequest(
    title: string,
    body: string,
    branch: string,
    base: string
  ): Promise<PullRequestMeta> {
    try {
      const { html_url: url, number } = (
        await this.octokit.rest.pulls.create({
          owner: this.owner,
          repo: this.repo,
          title,
          body,
          base,
          head: branch
        })
      ).data;
      return {
        url,
        number
      };
    } catch (err) {
      switch (err?.response?.data?.errors[0]?.message) {
        case `No commits between ${base.toLowerCase()} and ${branch.toLowerCase()}`:
          throw new Error(`There is no new commit in branch ${branch}`);
        case `A pull request already exists for ${this.owner}:${branch}.`:
          throw new Error('Branch already has pull request');
        default:
          throw err;
      }
    }
  }

  public async addPullRequestComment(
    pullRequestNumber: number,
    body: string
  ): Promise<string> {
    try {
      return (await this.octokit.rest.issues.createComment({
          owner: this.owner,
          repo: this.repo,
          issue_number: pullRequestNumber,
          body
        })
      ).data.html_url;
    } catch (err) {
      switch (err.message) {
        case 'Not Found':
          throw new Error(
            'Cannot add comment to pull request: pull request not found'
          );
        default:
          console.log(err);
          throw err;
      }
    }
  }

  public async getOpenedPullRequest(branch: string): Promise<PullRequestMeta> {
    try {
      const [pullRequest] = (
        await this.octokit.rest.pulls.list({
          owner: this.owner,
          repo: this.repo,
          head: `${this.owner}:${branch}`,
          state: 'open'
        })
      ).data;
      if (pullRequest) {
        return {
          url: pullRequest.html_url,
          number: pullRequest.number
        };
      } else {
        return null;
      }
    } catch (err) {
      switch (err.message) {
        default:
          throw err;
      }
    }
  }

  public async updatePullRequest(
    number: number,
    state: boolean
  ): Promise<void> {
    await this.octokit.rest.pulls.update({
      owner: this.owner,
      repo: this.repo,
      pull_number: number,
      state: state ? 'open' : 'closed'
    });
  }

  public async createBranch(
    branch: string,
    headCommit: string
  ): Promise<string> {
    try {
      return (
        await this.octokit.rest.git.createRef({
          owner: this.owner,
          repo: this.repo,
          ref: `refs/heads/${branch}`,
          sha: headCommit
        })
      ).data.ref;
    } catch (err) {
      switch (err.message) {
        case 'Reference already exists':
          return null;
        default:
          throw err;
      }
    }
  }

  public async deleteBranch(branch: string): Promise<boolean> {
    try {
      const { status } = await this.octokit.rest.git.deleteRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${branch}`
      });
      return status === 204;
    } catch (exception) {
      switch (exception.message) {
        case 'Reference does not exist':
          return false;
        default:
          throw exception;
      }
    }
  }

  public async getBranch(branch: string): Promise<{ headCommit: string }> {
    try {
      const { data } = await this.octokit.rest.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch
      });
      return {
        headCommit: data.commit.sha
      };
    } catch (exception) {
      switch (exception.message) {
        case 'Branch not found':
          return null;
        default:
          throw exception;
      }
    }
  }

  public async getDefaultBranchName(): Promise<string> {
    return (
      await this.octokit.rest.repos.get({
        owner: this.owner,
        repo: this.repo
      })
    ).data.default_branch;
  }

  public async createRepository(_private: boolean): Promise<string> {
    try {
      const { data: repo } = await this.octokit.rest.repos.createInOrg({
        name: this.repo,
        org: this.owner,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        auto_init: true,
        private: _private
      });
      return repo.url;
    } catch (err) {
      switch (err.status) {
        case 422:
          return null;
        default:
          throw err;
      }
    }
  }

  public async deleteRepository(): Promise<string> {
    try {
      const { data: repo } = await this.octokit.rest.repos.delete({
        owner: this.owner,
        repo: this.repo
      });
      return repo;
    } catch (err) {
      switch (err.message) {
        case 'Not Found':
          return null;
        default:
          throw err;
      }
    }
  }

  public async getRepository(): Promise<{ private: boolean }> {
    const { data: repo } = await this.octokit.rest.repos.get({
      owner: this.owner,
      repo: this.repo
    });
    return {
      private: repo.private
    };
  }

  public async getOrganizationPlan(): Promise<string> {
    const { data: org } = await this.octokit.rest.orgs.get({
      org: this.owner
    });
    return org.plan.name;
  }
}
