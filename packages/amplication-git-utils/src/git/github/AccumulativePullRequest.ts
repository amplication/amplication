import {
  Changes,
  File,
  TreeParameter,
  UpdateFunctionFile,
} from "octokit-plugin-create-pull-request/dist-types/types";
import { Branch } from "../dto";
import { CreatePrDto } from "../dto/create-pr.dto";
import { RemoteGitRepository } from "../dto/remote-git-repository";
import { BasePullRequest } from "./BasePullRequest";

export class AccumulativePullRequest extends BasePullRequest {
  async createPullRequest(
    prTitle: string,
    prBody: string,
    head: string,
    files: Required<Changes["files"]>,
    commitMessage: string
  ): Promise<string> {
    await this.validateOrCreateBranch(head);
    await this.appendCommitOnBranch(commitMessage, head, files);
    const repository = await this.getRepository();
    const existingPullRequest = await this.existingPullRequest(head);
    if (!existingPullRequest) {
      console.info("The PR does not exist, creating a new one");
      return await this.createGitPullRequest({
        title: prTitle,
        body: prBody,
        head,
        base: repository.defaultBranch,
      });
    }
    console.info(`The PR already exists, ${existingPullRequest.url}`);
    return existingPullRequest.url;
  }

  private async validateOrCreateBranch(branch: string): Promise<Branch> {
    const { sha } = await this.getFirstDefaultBranchCommit();
    const isBranchExist = await this.isBranchExist(branch);
    if (!isBranchExist) {
      return this.createBranch(branch, sha);
    }
    return this.getBranch(branch);
  }

  private async isBranchExist(branch: string): Promise<boolean> {
    try {
      const refs = await this.getBranch(branch);
      return Boolean(refs);
    } catch (error) {
      return false;
    }
  }

  private async createBranch(
    newBranchName: string,
    sha?: string
  ): Promise<Branch> {
    const { octokit, owner, repo } = this;
    let baseSha = sha;
    if (!baseSha) {
      const repository = await this.getRepository();
      const { defaultBranch } = repository;

      const refs = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${defaultBranch}`,
      });
      baseSha = refs.data.object.sha;
    }
    const { data: branch } = await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${newBranchName}`,
      sha: baseSha,
    });
    return { name: newBranchName, sha: branch.object.sha };
  }

  private async getFirstDefaultBranchCommit(): Promise<{ sha: string }> {
    const { octokit, owner, repo } = this;
    const { defaultBranch } = await this.getRepository();
    const firstCommit: TData = await octokit.graphql(
      `query ($owner: String!, $repo: String!, $defaultBranch: String!) {
      repository(name: $repo, owner: $owner) {
        ref(qualifiedName: $defaultBranch) {
          target {
            ... on Commit {
              history(first: 1) {
                nodes {
                  oid
                  url
                }
                totalCount
                pageInfo {
                  endCursor
                }
              }
            }
          }
        }
      }
    }`,
      {
        owner,
        repo,
        defaultBranch,
      }
    );
    const {
      repository: {
        ref: {
          target: {
            history: { nodes: firstCommitNodes, pageInfo, totalCount },
          },
        },
      },
    } = firstCommit;

    if (totalCount <= 1) {
      return { sha: firstCommitNodes[0].oid };
    }

    const cursorPrefix = pageInfo.endCursor.split(" ")[0];
    const nextCursor = `${cursorPrefix} ${totalCount - 2}`;

    const lastCommitData: TData = await octokit.graphql(
      `query ($owner: String!, $repo: String!, $defaultBranch: String!, $nextCursor: String!) {
        repository(name: $repo, owner: $owner) {
          ref(qualifiedName: $defaultBranch) {
            target {
              ... on Commit {
                history(first: 1, after: $nextCursor) {
                  nodes {
                    oid
                    url
                  }
                  totalCount
                  pageInfo {
                    endCursor
                  }
                }
              }
            }
          }
        }
      }`,
      { owner, repo, defaultBranch, nextCursor }
    );
    const {
      repository: {
        ref: {
          target: {
            history: { nodes: lastCommitNodes },
          },
        },
      },
    } = lastCommitData;
    return { sha: lastCommitNodes[0].oid };
  }

  private async existingPullRequest(
    head: string
  ): Promise<{ url: string; number: number } | undefined> {
    const { octokit, owner, repo } = this;
    const branchInfo: {
      repository: {
        ref: {
          associatedPullRequests: {
            edges: [
              {
                node: {
                  url: string;
                  number: number;
                };
              }
            ];
          };
        };
      };
    } = await octokit.graphql(
      `
          query ($owner: String!, $repo: String!, $head: String!) {
            repository(name: $repo, owner: $owner) {
              ref(qualifiedName: $head) {
                associatedPullRequests(first: 1, states: OPEN) {
                  edges {
                    node {
                      id
                      number
                      url
                    }
                  }
                }
              }
            }
          }`,
      {
        owner,
        repo,
        head,
      }
    );

    const existingPullRequest =
      branchInfo.repository.ref?.associatedPullRequests?.edges?.[0]?.node;

    return existingPullRequest;
  }

  private async appendCommitOnBranch(
    message: string,
    branchName: string,
    changes: Required<Changes["files"]>
  ) {
    const { octokit, owner, repo } = this;
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

  private async getLastCommit(branchName: string) {
    const { owner, repo, octokit } = this;
    const branch = await this.getBranch(branchName);

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

  private async getBranch(branch: string): Promise<Branch> {
    const { owner, repo, octokit } = this;
    const { data: ref } = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    console.log(`Got branch ${owner}/${repo}/${branch} with url ${ref.url}`);

    return { sha: ref.object.sha, name: branch };
  }

  private async createTree(
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

  private async valueToTreeObject(path: string, value: string | File) {
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

  private async createGitPullRequest({ title, head, base, body }: CreatePrDto) {
    const { octokit, owner, repo } = this;
    const { data: pullRequest } = await octokit.rest.pulls.create({
      owner,
      repo,
      title,
      head,
      base,
      body,
    });
    return pullRequest.html_url;
  }

  private async getRepository(): Promise<RemoteGitRepository> {
    const { octokit, owner, repo } = this;
    const {
      data: {
        permissions: { admin },
        url,
        private: isPrivate,
        name,
        full_name: fullName,
        default_branch: defaultBranch,
      },
    } = await octokit.rest.repos.get({
      owner,
      repo,
    });

    return {
      admin,
      defaultBranch,
      fullName,
      name,
      private: isPrivate,
      url,
    };
  }
}

type TData = {
  repository: {
    ref: {
      target: {
        history: {
          nodes: [
            {
              oid: string;
              url: string;
            }
          ];
          pageInfo: {
            endCursor: string;
          };
          totalCount: number;
        };
      };
    };
  };
};
