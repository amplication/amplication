import { Changes } from "octokit-plugin-create-pull-request/dist-types/types";

export class BasicPullRequest {
  async createPullRequest(
    octokit: any,
    owner: string,
    repo: string,
    prTitle: string,
    prBody: string,
    head: string,
    files: Required<Changes["files"]>,
    commitMessage: string
  ): Promise<string> {
    const pr = await octokit.createPullRequest({
      owner,
      repo,
      title: prTitle,
      body: prBody,
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
}
