import { Changes } from "octokit-plugin-create-pull-request/dist-types/types";
import { BasePullRequest } from "./BasePullRequest";

export class BasicPullRequest extends BasePullRequest {
  async createPullRequest(
    prTitle: string,
    prBody: string,
    head: string,
    files: Required<Changes["files"]>,
    commitMessage: string
  ): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const pr = await this.octokit.createPullRequest({
      owner: this.owner,
      repo: this.repo,
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
