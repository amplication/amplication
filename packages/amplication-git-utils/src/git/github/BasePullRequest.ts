import { Octokit } from "octokit";
import { Changes } from "octokit-plugin-create-pull-request/dist-types/types";
import { Branch } from "../dto";
import { createTree } from "./github-create-tree";

export abstract class BasePullRequest {
  constructor(protected readonly octokit: Octokit) {}

  async createCommit(
    octokit: Octokit,
    owner: string,
    repo: string,
    message: string,
    branchName: string,
    changes: Required<Changes["files"]>
  ) {
    const lastCommit = await this.getLastCommit(
      octokit,
      owner,
      repo,
      branchName
    );

    console.log(`Got last commit with url ${lastCommit.html_url}`);

    if (!lastCommit) {
      throw new Error("No last commit found");
    }

    const lastTreeSha = await createTree(
      octokit,
      owner,
      repo,
      lastCommit.sha,
      lastCommit.commit.tree.sha,
      changes
    );

    console.info(`Created tree for for ${owner}/${repo}`);

    const { data: commit } = await octokit.rest.git.createCommit({
      message,
      owner,
      repo,
      tree: lastTreeSha,
      parents: [lastCommit.sha],
    });

    console.info(`Created commit for ${owner}/${repo}`);

    await octokit.rest.git.updateRef({
      owner,
      repo,
      sha: commit.sha,
      ref: `heads/${branchName}`,
    });

    console.info(`Updated branch ${branchName} for ${owner}/${repo}`);
  }

  async getLastCommit(
    octokit: Octokit,
    owner: string,
    repo: string,
    branchName: string
  ) {
    const branch = await this.getBranch(octokit, owner, repo, branchName);

    console.log(
      `Got branch ${owner}/${repo}/${branch.name} with sha ${branch.sha}`
    );

    const [lastCommit] = (
      await octokit.rest.repos.listCommits({
        owner,
        repo,
        sha: branch.sha,
      })
    ).data;

    return lastCommit;
  }

  async getBranch(
    octokit: Octokit,
    owner: string,
    repo: string,
    branch: string
  ): Promise<Branch> {
    const { data: ref } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    console.log(`Got branch ${owner}/${repo}/${branch} with url ${ref.url}`);

    return { sha: ref.object.sha, name: branch };
  }
}
