import { Octokit } from "octokit";
import { Changes } from "octokit-plugin-create-pull-request/dist-types/types";
import { Branch } from "../dto";
import {
  File,
  TreeParameter,
  UpdateFunctionFile,
} from "octokit-plugin-create-pull-request/dist-types/types";

export abstract class BasePullRequest {
  constructor(
    protected readonly octokit: Octokit,
    protected readonly owner: string,
    protected readonly repo: string
  ) {}

  async createCommit(
    message: string,
    branchName: string,
    changes: Required<Changes["files"]>
  ) {
    const lastCommit = await this.getLastCommit(branchName);

    console.log(`Got last commit with url ${lastCommit.html_url}`);

    if (!lastCommit) {
      throw new Error("No last commit found");
    }

    const lastTreeSha = await this.createTree(
      lastCommit.sha,
      lastCommit.commit.tree.sha,
      changes
    );

    console.info(`Created tree for for ${this.owner}/${this.repo}`);

    const { data: commit } = await this.octokit.rest.git.createCommit({
      message,
      owner: this.owner,
      repo: this.repo,
      tree: lastTreeSha,
      parents: [lastCommit.sha],
    });

    console.info(`Created commit for ${this.owner}/${this.repo}`);

    await this.octokit.rest.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      sha: commit.sha,
      ref: `heads/${branchName}`,
    });

    console.info(`Updated branch ${branchName} for ${this.owner}/${this.repo}`);
  }

  async getLastCommit(branchName: string) {
    const { owner, repo } = this;
    const branch = await this.getBranch(branchName);

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

  async getBranch(branch: string): Promise<Branch> {
    const { owner, repo } = this;
    const { data: ref } = await this.octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    console.log(`Got branch ${owner}/${repo}/${branch} with url ${ref.url}`);

    return { sha: ref.object.sha, name: branch };
  }

  async createTree(
    latestCommitSha: string,
    latestCommitTreeSha: string,
    changes: Required<Changes["files"]>
  ): Promise<string | null> {
    const { owner, repo, octokit } = this;
    const tree = (
      await Promise.all(
        Object.keys(changes).map(async (path) => {
          const value = changes[path];

          if (value === null) {
            // Deleting a non-existent file from a tree leads to an "GitRPC::BadObjectState" error,
            // so we only attempt to delete the file if it exists.
            try {
              // https://developer.github.com/v3/repos/contents/#get-contents
              await octokit.request(
                "HEAD /repos/{owner}/{repo}/contents/:path",
                {
                  owner,
                  repo,
                  ref: latestCommitSha,
                  path,
                }
              );

              return {
                path,
                mode: "100644",
                sha: null,
              };
            } catch (error) {
              return;
            }
          }

          // When passed a function, retrieve the content of the file, pass it
          // to the function, then return the result
          if (typeof value === "function") {
            let result;

            try {
              const { data: file } = await octokit.request(
                "GET /repos/{owner}/{repo}/contents/:path",
                {
                  owner,
                  repo,
                  ref: latestCommitSha,
                  path,
                }
              );

              result = await value(
                Object.assign(file, { exists: true }) as UpdateFunctionFile
              );
            } catch (error) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              // istanbul ignore if
              if (error.status !== 404) throw error;

              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              result = await value({ exists: false });
            }

            if (result === null || typeof result === "undefined") return;
            return this.valueToTreeObject(path, result);
          }

          return this.valueToTreeObject(path, value);
        })
      )
    ).filter(Boolean) as TreeParameter;

    if (tree.length === 0) {
      return null;
    }

    // https://developer.github.com/v3/git/trees/#create-a-tree
    const {
      data: { sha: newTreeSha },
    } = await octokit.request("POST /repos/{owner}/{repo}/git/trees", {
      owner,
      repo,
      base_tree: latestCommitTreeSha,
      tree,
    });

    return newTreeSha;
  }

  async valueToTreeObject(path: string, value: string | File) {
    const { octokit, owner, repo } = this;
    let mode = "100644";
    if (value !== null && typeof value !== "string") {
      mode = value.mode || mode;
    }

    // Text files can be changed through the .content key
    if (typeof value === "string") {
      return {
        path,
        mode: mode,
        content: value,
      };
    }

    // Binary files need to be created first using the git blob API,
    // then changed by referencing in the .sha key
    const { data } = await octokit.request(
      "POST /repos/{owner}/{repo}/git/blobs",
      {
        owner,
        repo,
        ...value,
      }
    );
    const blobSha = data.sha;

    return {
      path,
      mode: mode,
      sha: blobSha,
    };
  }
}
