import { Octokit } from 'octokit';

export interface GitProviderBranch {
  createRepository(_private: boolean): Promise<string>;

  deleteRepository(): Promise<string>;

  getDefault(): Promise<string>;

  commit(
    message: string,
    files: { path: string; content: string }[]
  ): Promise<string>;

  setProtectionRules(): Promise<void>;

  deleteBranch(): Promise<boolean>;

  createBranch(): Promise<string>;

  getBranch(): Promise<{ headCommit: string }>;

  getRepository(): Promise<{ private: boolean }>;

  hasOpenPullRequest(): Promise<boolean>;

  createPullRequest(title: string, body: string, base: string): Promise<string>;

  exists(): Promise<boolean>;
}

export class GithubBranchProvider implements GitProviderBranch {
  constructor(
    private octokit: Octokit,
    private owner: string,
    private repo: string,
    private branch: string
  ) {}

  private static async getBranchHeadCommitSha(
    octokit: Octokit,
    owner: string,
    repo: string,
    branch: string
  ): Promise<string> {
    return (await octokit.rest.repos.getBranch({ owner, repo, branch })).data
      .commit.sha;
  }

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
        tree: files.map(file => {
          return {
            ...file,
            type: 'blob',
            mode: '100644'
          };
        }),
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
    message: string,
    files: { path: string; content: string }[]
  ): Promise<string> {
    const lastCommitSha = await GithubBranchProvider.getBranchHeadCommitSha(
      this.octokit,
      this.owner,
      this.repo,
      this.branch
    );
    const fileTreeSha = await GithubBranchProvider.createFilesTree(
      this.octokit,
      this.owner,
      this.repo,
      lastCommitSha,
      files
    );
    const commitSha = await GithubBranchProvider.createCommit(
      this.octokit,
      this.owner,
      this.repo,
      message,
      lastCommitSha,
      fileTreeSha
    );
    await GithubBranchProvider.updateRef(
      this.octokit,
      this.owner,
      this.repo,
      this.branch,
      commitSha
    );
    return commitSha;
  }

  public async createPullRequest(
    title: string,
    body: string,
    base: string
  ): Promise<string> {
    return (
      await this.octokit.rest.pulls.create({
        owner: this.owner,
        repo: this.repo,
        title,
        body,
        base,
        head: this.branch
      })
    ).data.url;
  }

  public async hasOpenPullRequest(): Promise<boolean> {
    return (
      (
        await this.octokit.rest.pulls.list({
          owner: this.owner,
          repo: this.repo,
          head: `${this.owner}:${this.branch}`,
          state: 'open'
        })
      ).data.length > 0
    );
  }

  public async exists(): Promise<boolean> {
    return (
      await this.octokit.rest.repos.listBranches({
        owner: this.owner,
        repo: this.repo,
        protected: true
      })
    ).data.some(({ name }) => name === this.branch);
  }

  public async createBranch(): Promise<string> {
    const base = await this.getDefault();
    const baseBranchLastCommit = await GithubBranchProvider.getBranchHeadCommitSha(
      this.octokit,
      this.owner,
      this.repo,
      base
    );
    return (
      await this.octokit.rest.git.createRef({
        owner: this.owner,
        repo: this.repo,
        ref: `refs/heads/${this.branch}`,
        sha: baseBranchLastCommit
      })
    ).data.ref;
  }

  public async deleteBranch(): Promise<boolean> {
    try {
      const { status } = await this.octokit.rest.git.deleteRef({
        owner: this.owner,
        repo: this.repo,
        ref: `heads/${this.branch}`
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

  public async getBranch(): Promise<{ headCommit: string }> {
    try {
      const { data: branch } = await this.octokit.rest.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: this.branch
      });
      return {
        headCommit: branch.commit.sha
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

  public async setProtectionRules(): Promise<void> {
    try {
      const res = await this.octokit.rest.repos.updateBranchProtection({
        owner: this.owner,
        repo: this.repo,
        branch: this.branch,
        required_status_checks: {
          strict: false,
          contexts: undefined
          // [
          //   'continuous-integration/travis-ci'
          // ]
        },
        enforce_admins: true,
        required_pull_request_reviews: {
          // dismissal_restrictions: {
          //   users: [
          //     'octocat'
          //   ],
          //   teams: [
          //     'justice-league'
          //   ]
          // },
          dismiss_stale_reviews: true,
          require_code_owner_reviews: false,
          required_approving_review_count: 2
        },
        restrictions: {
          users: ['octocat'],
          teams: ['justice-league'],
          apps: ['amplication']
        },
        required_linear_history: false,
        allow_force_pushes: false,
        allow_deletions: false,
        block_creations: false,
        required_conversation_resolution: false
      });
      console.log(res);
    } catch (exception) {
      switch (exception.message) {
        case 'Upgrade to GitHub Pro or make this repository public to enable this feature.':
        default:
          throw exception;
      }
    }
  }

  public async getDefault(): Promise<string> {
    return (
      await this.octokit.rest.repos.get({
        owner: this.owner,
        repo: this.repo
      })
    ).data.default_branch;
  }

  public async createRepository(_private: boolean): Promise<string> {
    const { data: repo } = await this.octokit.rest.repos.createInOrg({
      name: this.repo,
      org: this.owner,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      auto_init: true,
      private: _private
    });
    return repo.url;
  }

  public async deleteRepository(): Promise<string> {
    const { data: repo } = await this.octokit.rest.repos.delete({
      owner: this.owner,
      repo: this.repo
    });
    return repo;
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
