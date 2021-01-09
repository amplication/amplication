import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';
import { GithubRepo } from './dto/githubRepo';
import { createPullRequest } from 'octokit-plugin-create-pull-request';

export const GCS_BUCKET_VAR = 'GCS_BUCKET';

@Injectable()
export class GithubService {
  constructor(private readonly configService: ConfigService) {}

  async getRepos(userName: string): Promise<GithubRepo[]> {
    const octokit = new Octokit({
      auth:
        'XXXX' /**todo: get auth token from app settings or use clientID and clientSecret with authorized app*/
    });

    console.time();

    const results = await octokit.repos.listForAuthenticatedUser({
      username: userName,
      type: 'all'
    });

    console.timeEnd();

    console.log(results);

    return results.data.map(repo => ({
      name: repo.name,
      url: repo.url,
      private: repo.private,
      fullName: repo.full_name,
      admin: repo.permissions.admin
    }));
  }

  async createPullRequest(
    userName: string,
    repoName: string,
    modules: { path: string; code: string }[],
    commitName: string,
    commitMessage: string,
    commitDescription: string,
    baseBranchName: string
  ): Promise<boolean> {
    const myOctokit = Octokit.plugin(createPullRequest);

    const TOKEN =
      'XXXX'; /**todo: get auth token from app settings or use clientID and clientSecret with authorized app*/
    const octokit = new myOctokit({
      auth: TOKEN
    });

    const files = Object.fromEntries(
      modules.map(module => [module.path, module.code])
    );

    //console.log(files);

    //todo: delete files that are no longer part of the app

    // Returns a normal Octokit PR response
    // See https://octokit.github.io/rest.js/#octokit-routes-pulls-create
    const pr = await octokit.createPullRequest({
      owner: userName,
      repo: repoName,
      title: commitMessage,
      body: commitDescription,
      base: baseBranchName /* optional: defaults to default branch */,
      head: commitName,
      changes: [
        {
          /* optional: if `files` is not passed, an empty commit is created instead */
          files: files,
          // {
          //   'path/to/file1.txt': 'Content for file1',
          //   'path/to/file2.png': {
          //     content: '_base64_encoded_content_',
          //     encoding: 'base64'
          //   },
          //   // deletes file if it exists,
          //   'path/to/file3.txt': null,
          //   // updates file based on current content
          //   'path/to/file4.txt': ({ exists, encoding, content }) => {
          //     // do not create the file if it does not exist
          //     if (!exists) return null;

          //     return Buffer.from(content, encoding)
          //       .toString('utf-8')
          //       .toUpperCase();
          //   }
          // },
          commit: commitName
        }
      ]
    });

    console.log(pr);
    return true;
  }
}
