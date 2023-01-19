import { Changes } from "octokit-plugin-create-pull-request/dist-types/types";
import { BasePullRequest } from "./BasePullRequest";
import { BasicPullRequest } from "./BasicPullRequest";

export class AccumulativePullRequest extends BasePullRequest {
  async createPullRequest(
    owner: string,
    repo: string,
    prTitle: string,
    prBody: string,
    head: string,
    files: Required<Changes["files"]>,
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
    } = await this.octokit.graphql(
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

      return new BasicPullRequest(this.octokit).createPullRequest(
        owner,
        repo,
        prTitle,
        prBody,
        head,
        files,
        commitMessage
      );
    }

    console.info("The PR already exists, updating it");

    await this.createCommit(owner, repo, commitMessage, head, files);
    return existingPullRequest.url;
  }
}
