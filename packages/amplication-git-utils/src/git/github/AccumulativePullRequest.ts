import { Octokit } from "octokit";
import { Branch } from "../dto";

const fileModeCode = "100644";

export class AccumulativePullRequest {
  async createPullRequest(
    octokit: any,
    owner: string,
    repo: string,
    prTitle: string,
    prBody: string,
    baseBranchName: string,
    head: string,
    files: any,
    commitMessage: string
  ): Promise<string> {
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

    if (existingPullRequest) {
      console.log("existingPR", existingPullRequest.url);
    }

    if (!existingPullRequest) {
      console.info("The PR does not exist, creating a new one");
      // Returns a normal Octokit PR response
      // See https://octokit.github.io/rest.js/#octokit-routes-pulls-create
      const pr = await octokit.createPullRequest({
        owner,
        repo,
        title: prTitle,
        body: prBody,
        base: baseBranchName /* optional: defaults to default branch */,
        head,
        update: true,
        changes: [
          {
            /* optional: if `files` is not passed, an empty commit is created instead */
            files: files,
            commit: commitMessage,
          },
        ],
      });
      return pr.data.html_url;
    }

    console.info("The PR already exists, updating it");

    await this.createCommit(octokit, owner, repo, commitMessage, head, files);
    return existingPullRequest.url;
  }

  async createCommit(
    octokit: Octokit,
    owner: string,
    repo: string,
    message: string,
    branchName: string,
    changes: any
  ) {
    const changesArray = Object.entries(changes).map(([path, content]) => ({
      path,
      mode: fileModeCode,
      content,
    }));

    const lastCommit = await this.getLastCommit(
      octokit,
      owner,
      repo,
      branchName
    );

    console.log(`Got last commit with url ${lastCommit.html_url}`);

    if (changesArray.length === 0) {
      return;
    }

    if (!lastCommit) {
      throw new Error("No last commit found");
    }

    const { data: tree } = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: lastCommit.commit.tree.sha,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      tree: changesArray,
    });

    console.info(`Created tree for for ${owner}/${repo}`);

    const { data: commit } = await octokit.rest.git.createCommit({
      message,
      owner,
      repo,
      tree: tree.sha,
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

    console.log(`Got branch ${branch.name} with sha ${branch.sha}`);

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
      ref: `refs/heads/${branch}`,
    });

    console.log(`Got branch ${branch} with url ${ref.url}`);

    return { sha: ref.object.sha, name: branch };
  }
}
