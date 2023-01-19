import { Octokit } from "octokit";
import { Changes } from "octokit-plugin-create-pull-request/dist-types/types";
import { Branch } from "../dto";
import { createTree } from "./github-create-tree";

export abstract class BasePullRequest {
  constructor(protected readonly octokit: Octokit) {}

  async createCommit(
    owner: string,
    repo: string,
    message: string,
    branchName: string,
    changes: Required<Changes["files"]>
  ) {
    const lastCommit = await this.getLastCommit(owner, repo, branchName);

    console.log(`Got last commit with url ${lastCommit.html_url}`);

    if (!lastCommit) {
      throw new Error("No last commit found");
    }

    const lastTreeSha = await createTree(
      this.octokit,
      owner,
      repo,
      lastCommit.sha,
      lastCommit.commit.tree.sha,
      changes
    );

    console.info(`Created tree for for ${owner}/${repo}`);

    const { data: commit } = await this.octokit.rest.git.createCommit({
      message,
      owner,
      repo,
      tree: lastTreeSha,
      parents: [lastCommit.sha],
    });

    console.info(`Created commit for ${owner}/${repo}`);

    await this.octokit.rest.git.updateRef({
      owner,
      repo,
      sha: commit.sha,
      ref: `heads/${branchName}`,
    });

    console.info(`Updated branch ${branchName} for ${owner}/${repo}`);
  }

  async getLastCommit(owner: string, repo: string, branchName: string) {
    const branch = await this.getBranch(owner, repo, branchName);

    console.log(
      `Got branch ${owner}/${repo}/${branch.name} with sha ${branch.sha}`
    );

    const [lastCommit] = (
      await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        sha: branch.sha,
      })
    ).data;

    return lastCommit;
  }

  async getBranch(
    owner: string,
    repo: string,
    branch: string
  ): Promise<Branch> {
    const { data: ref } = await this.octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    console.log(`Got branch ${owner}/${repo}/${branch} with url ${ref.url}`);

    return { sha: ref.object.sha, name: branch };
  }
}
