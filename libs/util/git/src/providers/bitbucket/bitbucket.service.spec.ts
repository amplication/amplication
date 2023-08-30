import { parse } from "path";
import { BitBucketService } from "./bitbucket.service";
import { ILogger } from "@amplication/util/logging";
import * as requests from "./requests";
import {
  TreeEntry,
  PaginatedTreeEntry,
  Commit,
  Branch,
  PullRequestComment,
  PullRequest,
  PaginatedPullRequest,
} from "./bitbucket.types";
import { OAuthProviderOrganizationProperties } from "../../types";

jest.mock("fs");

const logger: ILogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  child: jest.fn(() => {
    return logger;
  }),
};

describe("bitbucket.service", () => {
  let service: BitBucketService;
  beforeEach(() => {
    service = new BitBucketService(
      {
        accessToken: "my-token",
      } as unknown as OAuthProviderOrganizationProperties,
      {
        clientId: "id",
        clientSecret: "secret",
      },
      logger
    );
    service.init();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("getFile", () => {
    it("throws when not base branch name is passed", async () => {
      expect.assertions(1);
      try {
        await service.getFile({
          owner: "maccheroni",
          path: "path/file.me",
          repositoryName: "myrepo",
        });
      } catch (e) {
        expect(e.message).toBe(
          "Missing repositoryGroupName. repositoryGroupName is mandatory for BitBucket provider"
        );
      }
    });

    it("returns error when path points to a directory instead of a file", async () => {
      const mockedGetFileMetaResponse = {
        size: 142,
        page: 102,
        pagelen: 159,
        next: "next",
        previous: "previous",
        values: [
          {
            type: "commit_directory",
            path: "tests",
            commit: {
              type: "commit",
            },
          },
        ],
      } as unknown as PaginatedTreeEntry;

      const spyOnRefreshToken = jest
        .spyOn(service, "refreshAccessTokenIfNeeded")
        .mockResolvedValue({
          accessToken: "my-token",
          expiresAt: 3600,
          refreshToken: "my-refresh-token",
          scopes: ["repository:write", "pullrequest:write"],
          tokenType: "bearer",
        });

      const spyOnGetFileRequest = jest
        .spyOn(requests, "getFileMetaRequest")
        .mockResolvedValue(mockedGetFileMetaResponse);

      expect.assertions(3);

      try {
        await service.getFile({
          path: "tests/",
          owner: "mr-bucket",
          repositoryName: "my-repo",
          repositoryGroupName: "my-group",
          ref: "main",
        });
      } catch (e) {
        expect(e.message).toBe(
          "Path points to a directory, please provide a file path"
        );
      }

      expect(spyOnRefreshToken).toHaveBeenCalledTimes(1);
      expect(spyOnGetFileRequest).toHaveBeenCalledTimes(1);
    });

    it("returns GitFile object for path", async () => {
      const mockedGetFileResponse = {
        links: {
          self: {
            href: "https://api.bitbucket.org/2.0/repositories/atlassian/bbql/src/eefd5ef5d3df01aed629f650959d6706d54cd335/tests/__init__.py",
          },
          meta: {
            href: "https://api.bitbucket.org/2.0/repositories/atlassian/bbql/src/eefd5ef5d3df01aed629f650959d6706d54cd335/tests/__init__.py?format=meta",
          },
        },
        path: "tests/__init__.py",
        commit: {
          type: "commit",
          hash: "eefd5ef5d3df01aed629f650959d6706d54cd335",
          links: {
            self: {
              href: "https://api.bitbucket.org/2.0/repositories/atlassian/bbql/commit/eefd5ef5d3df01aed629f650959d6706d54cd335",
            },
            html: {
              href: "https://bitbucket.org/atlassian/bbql/commits/eefd5ef5d3df01aed629f650959d6706d54cd335",
            },
          },
        },
        attributes: [],
        type: "commit_file",
        size: 0,
      } as unknown as TreeEntry;

      // const mockGetFileResponse =
      const spyOnGetFileMetaRequest = jest
        .spyOn(requests, "getFileMetaRequest")
        .mockResolvedValue(mockedGetFileResponse);

      const spyOnGetFileRequest = jest
        .spyOn(requests, "getFileRequest")
        .mockResolvedValue(Buffer.from("Mocked content", "utf-8"));

      const spyOnRefreshToken = jest
        .spyOn(service, "refreshAccessTokenIfNeeded")
        .mockResolvedValue({
          accessToken: "my-token",
          expiresAt: 3600,
          refreshToken: "my-refresh-token",
          scopes: ["repository:write", "pullrequest:write"],
          tokenType: "bearer",
        });

      const result = await service.getFile({
        path: "tests/__init__.py",
        owner: "mr-bucket",
        repositoryName: "my-repo",
        repositoryGroupName: "my-group",
        ref: "main",
      });

      const expectedResult = {
        content: await (
          await spyOnGetFileRequest.mock.results[0].value
        ).toString("utf-8"),
        name: parse(mockedGetFileResponse.path).name,
        path: mockedGetFileResponse.path,
      };

      expect(spyOnRefreshToken).toHaveBeenCalledTimes(1);
      expect(spyOnGetFileMetaRequest).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("getFirstCommitOnBranch", () => {
    it("throws when git group name wasn't provider", async () => {
      expect.assertions(1);
      try {
        await service.getFirstCommitOnBranch({
          owner: "maccheroni",
          branchName: "master",
          repositoryName: "myrepo",
        });
      } catch (e) {
        expect(e.message).toBe("Missing repositoryGroupName");
      }
    });

    it("get the last commit on the provided branch name", async () => {
      const mockedGetFirstCommitResponse = {
        type: "commit",
        hash: "7780b0365ff60174493acc8706f104aee97308a1",
        date: "2022-12-30T12:25:04+00:00",
        author: {
          type: "author",
          raw: "Amit Barletz <barletz.amit19@gmail.com>",
          user: {
            display_name: "Amit Barletz",
            links: {
              self: {
                href: "https://api.bitbucket.org/2.0/users/%7Bc3f8c1a5-185c-4fee-9bc1-bbceae764ab4%7D",
              },
              avatar: {
                href: "https://secure.gravatar.com/avatar/616027f81a603dc0c8a139eb11af65f7?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAB-3.png",
              },
              html: {
                href: "https://bitbucket.org/%7Bc3f8c1a5-185c-4fee-9bc1-bbceae764ab4%7D/",
              },
            },
            type: "user",
            uuid: "{c3f8c1a5-185c-4fee-9bc1-bbceae764ab4}",
            account_id: "5c0cb3e50ecb4f1b2ffaad26",
            nickname: "amit barletz",
          },
        },
        message: "Initial commit",
        summary: {
          type: "rendered",
          raw: "Initial commit",
          markup: "markdown",
          html: "<p>Initial commit</p>",
        },
        links: {
          self: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/7780b0365ff60174493acc8706f104aee97308a1",
          },
          html: {
            href: "https://bitbucket.org/ab-2/best-repo/commits/7780b0365ff60174493acc8706f104aee97308a1",
          },
          diff: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/diff/7780b0365ff60174493acc8706f104aee97308a1",
          },
          approve: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/7780b0365ff60174493acc8706f104aee97308a1/approve",
          },
          comments: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/7780b0365ff60174493acc8706f104aee97308a1/comments",
          },
          statuses: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/7780b0365ff60174493acc8706f104aee97308a1/statuses",
          },
          patch: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/patch/7780b0365ff60174493acc8706f104aee97308a1",
          },
        },
        parents: [],
        rendered: {
          message: {
            type: "rendered",
            raw: "Initial commit",
            markup: "markdown",
            html: "<p>Initial commit</p>",
          },
        },
        repository: {
          type: "repository",
          full_name: "ab-2/best-repo",
          links: {
            self: {
              href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo",
            },
            html: {
              href: "https://bitbucket.org/ab-2/best-repo",
            },
            avatar: {
              href: "https://bytebucket.org/ravatar/%7B23203fef-f9de-4268-9a81-a8402af296b6%7D?ts=default",
            },
          },
          name: "best-repo",
          uuid: "{23203fef-f9de-4268-9a81-a8402af296b6}",
        },
      } as unknown as Commit;

      const spyOnGetFirstCommitRequest = jest
        .spyOn(requests, "getFirstCommitRequest")
        .mockResolvedValue(mockedGetFirstCommitResponse);

      const spyOnRefreshToken = jest
        .spyOn(service, "refreshAccessTokenIfNeeded")
        .mockResolvedValue({
          accessToken: "my-token",
          expiresAt: 3600,
          refreshToken: "my-refresh-token",
          scopes: ["repository:write", "pullrequest:write"],
          tokenType: "bearer",
        });

      const result = await service.getFirstCommitOnBranch({
        owner: "maccheroni",
        branchName: "master",
        repositoryName: mockedGetFirstCommitResponse.repository.name,
        repositoryGroupName:
          mockedGetFirstCommitResponse.repository.full_name.split("/")[0],
      });

      const expected = { sha: mockedGetFirstCommitResponse.hash };

      expect(spyOnRefreshToken).toHaveBeenCalledTimes(1);
      expect(spyOnGetFirstCommitRequest).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expected);
    });
  });

  describe("getCloneUrl", () => {
    it("throws when git group name wasn't provider", async () => {
      expect.assertions(1);
      try {
        await service.getCloneUrl({
          owner: "maccheroni",
          repositoryName: "myrepo",
        });
      } catch (e) {
        expect(e.message).toBe("Missing repositoryGroupName");
      }
    });
    it("returns the clone url", async () => {
      const spyOnRefreshToken = jest
        .spyOn(service, "refreshAccessTokenIfNeeded")
        .mockResolvedValue({
          accessToken: "my-token",
          expiresAt: 3600,
          refreshToken: "my-refresh-token",
          scopes: ["repository:write", "pullrequest:write"],
          tokenType: "bearer",
        });

      const result = await service.getCloneUrl({
        owner: "maccheroni",
        repositoryName: "myrepo",
        repositoryGroupName: "mygroup",
      });

      expect(spyOnRefreshToken).toHaveBeenCalledTimes(1);
      expect(result).toEqual(
        "https://x-token-auth:my-token@bitbucket.org/mygroup/myrepo.git"
      );
    });
  });

  describe("getBranch", () => {
    it("throws when git group name wasn't provider", async () => {
      expect.assertions(1);
      try {
        await service.getBranch({
          owner: "maccheroni",
          branchName: "master",
          repositoryName: "myrepo",
        });
      } catch (e) {
        expect(e.message).toBe("Missing repositoryGroupName");
      }
    });

    it("returns the branch", async () => {
      const mockedGetBranchResponse = {
        name: "master",
        target: {
          type: "commit",
          hash: "bbfe95276c624e76c50aa640e7dba4af31b84961",
          date: "2023-03-21T16:48:56+00:00",
          author: {
            type: "author",
            raw: "Amit Barletz <barletz.amit19@gmail.com>",
            user: {
              display_name: "Amit Barletz",
              links: {
                self: {
                  href: "https://api.bitbucket.org/2.0/users/%7Bc3f8c1a5-185c-4fee-9bc1-bbceae764ab4%7D",
                },
                avatar: {
                  href: "https://secure.gravatar.com/avatar/616027f81a603dc0c8a139eb11af65f7?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAB-3.png",
                },
                html: {
                  href: "https://bitbucket.org/%7Bc3f8c1a5-185c-4fee-9bc1-bbceae764ab4%7D/",
                },
              },
              type: "user",
              uuid: "{c3f8c1a5-185c-4fee-9bc1-bbceae764ab4}",
              account_id: "5c0cb3e50ecb4f1b2ffaad26",
              nickname: "amit barletz",
            },
          },
          message: "Edited with Bitbucket",
          links: {
            self: {
              href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/bbfe95276c624e76c50aa640e7dba4af31b84961",
            },
            html: {
              href: "https://bitbucket.org/ab-2/best-repo/commits/bbfe95276c624e76c50aa640e7dba4af31b84961",
            },
            diff: {
              href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/diff/bbfe95276c624e76c50aa640e7dba4af31b84961",
            },
            approve: {
              href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/bbfe95276c624e76c50aa640e7dba4af31b84961/approve",
            },
            comments: {
              href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/bbfe95276c624e76c50aa640e7dba4af31b84961/comments",
            },
            statuses: {
              href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/bbfe95276c624e76c50aa640e7dba4af31b84961/statuses",
            },
            patch: {
              href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/patch/bbfe95276c624e76c50aa640e7dba4af31b84961",
            },
          },
          parents: [
            {
              type: "commit",
              hash: "714235717e951465925b28b84673368ca70a6e94",
              links: {
                self: {
                  href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/714235717e951465925b28b84673368ca70a6e94",
                },
                html: {
                  href: "https://bitbucket.org/ab-2/best-repo/commits/714235717e951465925b28b84673368ca70a6e94",
                },
              },
            },
          ],
          repository: {
            type: "repository",
            full_name: "ab-2/best-repo",
            links: {
              self: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo",
              },
              html: {
                href: "https://bitbucket.org/ab-2/best-repo",
              },
              avatar: {
                href: "https://bytebucket.org/ravatar/%7B23203fef-f9de-4268-9a81-a8402af296b6%7D?ts=default",
              },
            },
            name: "best-repo",
            uuid: "{23203fef-f9de-4268-9a81-a8402af296b6}",
          },
        },
        links: {
          self: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/refs/branches/master",
          },
          commits: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commits/master",
          },
          html: {
            href: "https://bitbucket.org/ab-2/best-repo/branch/master",
          },
        },
        type: "branch",
        merge_strategies: ["merge_commit", "squash", "fast_forward"],
        default_merge_strategy: "merge_commit",
      } as unknown as Branch;

      const spyOnGetBranchRequest = jest
        .spyOn(requests, "getBranchRequest")
        .mockResolvedValue(mockedGetBranchResponse);

      const spyOnRefreshToken = jest
        .spyOn(service, "refreshAccessTokenIfNeeded")
        .mockResolvedValue({
          accessToken: "my-token",
          expiresAt: 3600,
          refreshToken: "my-refresh-token",
          scopes: ["repository:write", "pullrequest:write"],
          tokenType: "bearer",
        });

      const result = await service.getBranch({
        owner: "maccheroni",
        branchName: "master",
        repositoryName: "my-repo",
        repositoryGroupName: "my-group",
      });

      const expectedResult = {
        name: "master",
        sha: "bbfe95276c624e76c50aa640e7dba4af31b84961",
      };

      expect(spyOnRefreshToken).toHaveBeenCalledTimes(1);
      expect(spyOnGetBranchRequest).toBeCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("createBranch", () => {
    it("throws when git group name wasn't provider", async () => {
      expect.assertions(1);
      try {
        await service.getBranch({
          owner: "maccheroni",
          branchName: "master",
          repositoryName: "myrepo",
        });
      } catch (e) {
        expect(e.message).toBe("Missing repositoryGroupName");
      }
    });

    it("create the branch", async () => {
      const mockedCreateBranchResponse = {
        name: "amit-test",
        target: {
          type: "commit",
          hash: "bbfe95276c624e76c50aa640e7dba4af31b84961",
          date: "2023-03-21T16:48:56+00:00",
          author: {
            type: "author",
            raw: "Amit Barletz <barletz.amit19@gmail.com>",
            user: {
              display_name: "Amit Barletz",
              links: {
                self: {
                  href: "https://api.bitbucket.org/2.0/users/%7Bc3f8c1a5-185c-4fee-9bc1-bbceae764ab4%7D",
                },
                avatar: {
                  href: "https://secure.gravatar.com/avatar/616027f81a603dc0c8a139eb11af65f7?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAB-3.png",
                },
                html: {
                  href: "https://bitbucket.org/%7Bc3f8c1a5-185c-4fee-9bc1-bbceae764ab4%7D/",
                },
              },
              type: "user",
              uuid: "{c3f8c1a5-185c-4fee-9bc1-bbceae764ab4}",
              account_id: "5c0cb3e50ecb4f1b2ffaad26",
              nickname: "amit barletz",
            },
          },
          message: "Edited with Bitbucket",
          links: {
            self: {
              href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/bbfe95276c624e76c50aa640e7dba4af31b84961",
            },
            html: {
              href: "https://bitbucket.org/ab-2/best-repo/commits/bbfe95276c624e76c50aa640e7dba4af31b84961",
            },
            diff: {
              href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/diff/bbfe95276c624e76c50aa640e7dba4af31b84961",
            },
            approve: {
              href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/bbfe95276c624e76c50aa640e7dba4af31b84961/approve",
            },
            comments: {
              href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/bbfe95276c624e76c50aa640e7dba4af31b84961/comments",
            },
            statuses: {
              href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/bbfe95276c624e76c50aa640e7dba4af31b84961/statuses",
            },
            patch: {
              href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/patch/bbfe95276c624e76c50aa640e7dba4af31b84961",
            },
          },
          parents: [
            {
              type: "commit",
              hash: "714235717e951465925b28b84673368ca70a6e94",
              links: {
                self: {
                  href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/714235717e951465925b28b84673368ca70a6e94",
                },
                html: {
                  href: "https://bitbucket.org/ab-2/best-repo/commits/714235717e951465925b28b84673368ca70a6e94",
                },
              },
            },
          ],
          repository: {
            type: "repository",
            full_name: "ab-2/best-repo",
            links: {
              self: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo",
              },
              html: {
                href: "https://bitbucket.org/ab-2/best-repo",
              },
              avatar: {
                href: "https://bytebucket.org/ravatar/%7B23203fef-f9de-4268-9a81-a8402af296b6%7D?ts=default",
              },
            },
            name: "best-repo",
            uuid: "{23203fef-f9de-4268-9a81-a8402af296b6}",
          },
        },
        links: {
          self: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/refs/branches/amit-test",
          },
          commits: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commits/amit-test",
          },
          html: {
            href: "https://bitbucket.org/ab-2/best-repo/branch/amit-test",
          },
        },
        type: "branch",
        merge_strategies: ["merge_commit", "squash", "fast_forward"],
        default_merge_strategy: "merge_commit",
      } as unknown as Branch;

      const spyOnRefreshToken = jest
        .spyOn(service, "refreshAccessTokenIfNeeded")
        .mockResolvedValue({
          accessToken: "my-token",
          expiresAt: 3600,
          refreshToken: "my-refresh-token",
          scopes: ["repository:write", "pullrequest:write"],
          tokenType: "bearer",
        });

      const spyOnGetBranchRequest = jest
        .spyOn(requests, "createBranchRequest")
        .mockResolvedValue(mockedCreateBranchResponse);

      const result = await service.createBranch({
        owner: "maccheroni",
        repositoryName: "my-repo",
        branchName: "amit-test",
        pointingSha: "bbfe95276c624e76c50aa640e7dba4af31b84961",
        repositoryGroupName: "my-group",
        baseBranchName: "master",
      });

      const expectedResult = {
        name: mockedCreateBranchResponse.name,
        sha: mockedCreateBranchResponse.target.hash,
      };

      expect(spyOnRefreshToken).toHaveBeenCalledTimes(1);
      expect(spyOnGetBranchRequest).toBeCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("createPullRequestComment", () => {
    it("throws when git group name wasn't provider", async () => {
      expect.assertions(1);
      try {
        await service.createPullRequestComment({
          where: {
            issueNumber: 1,
            owner: "maccheroni",
            repositoryName: "my-repo",
          },
          data: { body: "this is my comment for the pull request" },
        });
      } catch (e) {
        expect(e.message).toBe("Missing repositoryGroupName");
      }
    });

    it("create a comment on a pull request successfully", async () => {
      const mockedCreateCommentOnResponse = {
        id: 380826942,
        created_on: "2023-03-23T11:08:07.188285+00:00",
        updated_on: "2023-03-23T11:08:07.188336+00:00",
        content: {
          type: "rendered",
          raw: "test for bitbucket task",
          markup: "markdown",
          html: "<p>test for bitbucket task</p>",
        },
        user: {
          display_name: "Amit Barletz",
          links: {
            self: {
              href: "https://api.bitbucket.org/2.0/users/%7Bc3f8c1a5-185c-4fee-9bc1-bbceae764ab4%7D",
            },
            avatar: {
              href: "https://secure.gravatar.com/avatar/616027f81a603dc0c8a139eb11af65f7?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAB-3.png",
            },
            html: {
              href: "https://bitbucket.org/%7Bc3f8c1a5-185c-4fee-9bc1-bbceae764ab4%7D/",
            },
          },
          type: "user",
          uuid: "{c3f8c1a5-185c-4fee-9bc1-bbceae764ab4}",
          account_id: "5c0cb3e50ecb4f1b2ffaad26",
          nickname: "amit barletz",
        },
        deleted: false,
        type: "pullrequest_comment",
        links: {
          self: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/1/comments/380826942",
          },
          html: {
            href: "https://bitbucket.org/ab-2/best-repo/pull-requests/1/_/diff#comment-380826942",
          },
        },
        pullrequest: {
          type: "pullrequest",
          id: 1,
          title: "new-test.txt created online with Bitbucket",
          links: {
            self: {
              href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/1",
            },
            html: {
              href: "https://bitbucket.org/ab-2/best-repo/pull-requests/1",
            },
          },
        },
      } as unknown as PullRequestComment;

      const spyOnCreateCommentOnPrRequest = jest
        .spyOn(requests, "createCommentOnPrRequest")
        .mockResolvedValue(mockedCreateCommentOnResponse);

      const spyOnRefreshToken = jest
        .spyOn(service, "refreshAccessTokenIfNeeded")
        .mockResolvedValue({
          accessToken: "my-token",
          expiresAt: 3600,
          refreshToken: "my-refresh-token",
          scopes: ["repository:write", "pullrequest:write"],
          tokenType: "bearer",
        });

      await service.createPullRequestComment({
        where: {
          issueNumber: 1,
          owner: "maccheroni",
          repositoryName: "my-repo",
          repositoryGroupName: "my-group",
        },
        data: { body: "this is my comment for the pull request" },
      });

      expect(spyOnRefreshToken).toHaveBeenCalledTimes(1);
      expect(spyOnCreateCommentOnPrRequest).toHaveBeenCalledTimes(1);
      expect(spyOnCreateCommentOnPrRequest).toHaveBeenCalledWith(
        "my-group",
        "my-repo",
        1,
        "this is my comment for the pull request",
        "my-token"
      );
    });
  });

  describe("getPullRequest", () => {
    it("throws when git group name wasn't provider", async () => {
      expect.assertions(1);
      try {
        await service.getPullRequest({
          owner: "maccheroni",
          branchName: "master",
          repositoryName: "myrepo",
        });
      } catch (e) {
        expect(e.message).toBe("Missing repositoryGroupName");
      }
    });

    it("returns the pull request", async () => {
      const mockedGetPullRequestResponse = {
        values: [
          {
            comment_count: 1,
            task_count: 0,
            type: "pullrequest",
            id: 1,
            title: "amplication pull reequest",
            description: "",
            state: "OPEN",
            merge_commit: null,
            close_source_branch: false,
            closed_by: null,
            author: {
              display_name: "Amit Barletz",
              links: {
                self: {
                  href: "https://api.bitbucket.org/2.0/users/%7Bc3f8c1a5-185c-4fee-9bc1-bbceae764ab4%7D",
                },
                avatar: {
                  href: "https://secure.gravatar.com/avatar/616027f81a603dc0c8a139eb11af65f7?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAB-3.png",
                },
                html: {
                  href: "https://bitbucket.org/%7Bc3f8c1a5-185c-4fee-9bc1-bbceae764ab4%7D/",
                },
              },
              type: "user",
              uuid: "{c3f8c1a5-185c-4fee-9bc1-bbceae764ab4}",
              account_id: "5c0cb3e50ecb4f1b2ffaad26",
              nickname: "amit barletz",
            },
            reason: "",
            created_on: "2023-03-23T11:05:17.777468+00:00",
            updated_on: "2023-03-29T08:33:38.345104+00:00",
            destination: {
              branch: {
                name: "master",
              },
              commit: {
                type: "commit",
                hash: "4f2b7ade662f",
                links: {
                  self: {
                    href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/4f2b7ade662f",
                  },
                  html: {
                    href: "https://bitbucket.org/ab-2/best-repo/commits/4f2b7ade662f",
                  },
                },
              },
              repository: {
                type: "repository",
                full_name: "ab-2/best-repo",
                links: {
                  self: {
                    href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo",
                  },
                  html: {
                    href: "https://bitbucket.org/ab-2/best-repo",
                  },
                  avatar: {
                    href: "https://bytebucket.org/ravatar/%7B23203fef-f9de-4268-9a81-a8402af296b6%7D?ts=default",
                  },
                },
                name: "best-repo",
                uuid: "{23203fef-f9de-4268-9a81-a8402af296b6}",
              },
            },
            source: {
              branch: {
                name: "dev",
              },
              commit: {
                type: "commit",
                hash: "e0c79bbe1aec",
                links: {
                  self: {
                    href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/e0c79bbe1aec",
                  },
                  html: {
                    href: "https://bitbucket.org/ab-2/best-repo/commits/e0c79bbe1aec",
                  },
                },
              },
              repository: {
                type: "repository",
                full_name: "ab-2/best-repo",
                links: {
                  self: {
                    href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo",
                  },
                  html: {
                    href: "https://bitbucket.org/ab-2/best-repo",
                  },
                  avatar: {
                    href: "https://bytebucket.org/ravatar/%7B23203fef-f9de-4268-9a81-a8402af296b6%7D?ts=default",
                  },
                },
                name: "best-repo",
                uuid: "{23203fef-f9de-4268-9a81-a8402af296b6}",
              },
            },
            links: {
              self: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/1",
              },
              html: {
                href: "https://bitbucket.org/ab-2/best-repo/pull-requests/1",
              },
              commits: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/1/commits",
              },
              approve: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/1/approve",
              },
              "request-changes": {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/1/request-changes",
              },
              diff: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/diff/ab-2/best-repo:e0c79bbe1aec%0D4f2b7ade662f?from_pullrequest_id=1&topic=true",
              },
              diffstat: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/diffstat/ab-2/best-repo:e0c79bbe1aec%0D4f2b7ade662f?from_pullrequest_id=1&topic=true",
              },
              comments: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/1/comments",
              },
              activity: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/1/activity",
              },
              merge: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/1/merge",
              },
              decline: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/1/decline",
              },
              statuses: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/1/statuses",
              },
            },
            summary: {
              type: "rendered",
              raw: "",
              markup: "markdown",
              html: "",
            },
          },
        ],
        pagelen: 10,
        size: 1,
        page: 1,
      } as unknown as PaginatedPullRequest;

      const spyOnRefreshToken = jest
        .spyOn(service, "refreshAccessTokenIfNeeded")
        .mockResolvedValue({
          accessToken: "my-token",
          expiresAt: 3600,
          refreshToken: "my-refresh-token",
          scopes: ["repository:write", "pullrequest:write"],
          tokenType: "bearer",
        });

      const spyOnGetPullRequestByBranchNameRequest = jest
        .spyOn(requests, "getPullRequestByBranchNameRequest")
        .mockResolvedValue(mockedGetPullRequestResponse);

      const pullRequest = mockedGetPullRequestResponse.values[0];
      const result = await service.getPullRequest({
        owner: "maccheroni",
        branchName: pullRequest.source.branch.name,
        repositoryName: pullRequest.source.repository.name,
        repositoryGroupName:
          pullRequest.source.repository.full_name.split("/")[0],
      });

      const expectedResult = {
        url: "https://bitbucket.org/ab-2/best-repo/pull-requests/1",
        number: 1,
      };

      expect(spyOnRefreshToken).toHaveBeenCalledTimes(1);
      expect(spyOnGetPullRequestByBranchNameRequest).toBeCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("createPullRequest", () => {
    it("throws when git group name wasn't provider", async () => {
      expect.assertions(1);
      try {
        await service.createPullRequest({
          owner: "maccheroni",
          repositoryName: "myrepo",
          branchName: "feat/my-feature",
          baseBranchName: "dev",
          pullRequestTitle: "my pull request title",
          pullRequestBody: "my pull request body",
        });
      } catch (e) {
        expect(e.message).toBe("Missing repositoryGroupName");
      }
    });

    it("create the branch", async () => {
      const mockedCreatePullRequestResponse = {
        comment_count: 0,
        task_count: 0,
        type: "pullrequest",
        id: 2,
        title: "remove unused file",
        description: "",
        rendered: {
          title: {
            type: "rendered",
            raw: "remove unused file",
            markup: "markdown",
            html: "<p>remove unused file</p>",
          },
          description: {
            type: "rendered",
            raw: "description for my pull request",
            markup: "markdown",
            html: "",
          },
        },
        state: "OPEN",
        merge_commit: null,
        close_source_branch: false,
        closed_by: null,
        author: {
          display_name: "Amit Barletz",
          links: {
            self: {
              href: "https://api.bitbucket.org/2.0/users/%7Bc3f8c1a5-185c-4fee-9bc1-bbceae764ab4%7D",
            },
            avatar: {
              href: "https://secure.gravatar.com/avatar/616027f81a603dc0c8a139eb11af65f7?d=https%3A%2F%2Favatar-management--avatars.us-west-2.prod.public.atl-paas.net%2Finitials%2FAB-3.png",
            },
            html: {
              href: "https://bitbucket.org/%7Bc3f8c1a5-185c-4fee-9bc1-bbceae764ab4%7D/",
            },
          },
          type: "user",
          uuid: "{c3f8c1a5-185c-4fee-9bc1-bbceae764ab4}",
          account_id: "5c0cb3e50ecb4f1b2ffaad26",
          nickname: "amit barletz",
        },
        reason: "",
        created_on: "2023-04-01T10:49:58.856095+00:00",
        updated_on: "2023-04-01T10:49:59.853796+00:00",
        destination: {
          branch: {
            name: "dev",
          },
          commit: {
            type: "commit",
            hash: "e0c79bbe1aec",
            links: {
              self: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/e0c79bbe1aec",
              },
              html: {
                href: "https://bitbucket.org/ab-2/best-repo/commits/e0c79bbe1aec",
              },
            },
          },
          repository: {
            type: "repository",
            full_name: "ab-2/best-repo",
            links: {
              self: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo",
              },
              html: {
                href: "https://bitbucket.org/ab-2/best-repo",
              },
              avatar: {
                href: "https://bytebucket.org/ravatar/%7B23203fef-f9de-4268-9a81-a8402af296b6%7D?ts=default",
              },
            },
            name: "best-repo",
            uuid: "{23203fef-f9de-4268-9a81-a8402af296b6}",
          },
        },
        source: {
          branch: {
            name: "amit",
          },
          commit: {
            type: "commit",
            hash: "4e878018c732",
            links: {
              self: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/4e878018c732",
              },
              html: {
                href: "https://bitbucket.org/ab-2/best-repo/commits/4e878018c732",
              },
            },
          },
          repository: {
            type: "repository",
            full_name: "ab-2/best-repo",
            links: {
              self: {
                href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo",
              },
              html: {
                href: "https://bitbucket.org/ab-2/best-repo",
              },
              avatar: {
                href: "https://bytebucket.org/ravatar/%7B23203fef-f9de-4268-9a81-a8402af296b6%7D?ts=default",
              },
            },
            name: "best-repo",
            uuid: "{23203fef-f9de-4268-9a81-a8402af296b6}",
          },
        },
        reviewers: [],
        participants: [],
        links: {
          self: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/2",
          },
          html: {
            href: "https://bitbucket.org/ab-2/best-repo/pull-requests/2",
          },
          commits: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/2/commits",
          },
          approve: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/2/approve",
          },
          "request-changes": {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/2/request-changes",
          },
          diff: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/diff/ab-2/best-repo:4e878018c732%0De0c79bbe1aec?from_pullrequest_id=2&topic=true",
          },
          diffstat: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/diffstat/ab-2/best-repo:4e878018c732%0De0c79bbe1aec?from_pullrequest_id=2&topic=true",
          },
          comments: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/2/comments",
          },
          activity: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/2/activity",
          },
          merge: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/2/merge",
          },
          decline: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/2/decline",
          },
          statuses: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/pullrequests/2/statuses",
          },
        },
        summary: {
          type: "rendered",
          raw: "",
          markup: "markdown",
          html: "",
        },
      } as unknown as PullRequest;

      const spyOnCreatePullRequestFromRequest = jest
        .spyOn(requests, "createPullRequestFromRequest")
        .mockResolvedValue(mockedCreatePullRequestResponse);

      const spyOnRefreshToken = jest
        .spyOn(service, "refreshAccessTokenIfNeeded")
        .mockResolvedValue({
          accessToken: "my-token",
          expiresAt: 3600,
          refreshToken: "my-refresh-token",
          scopes: ["repository:write", "pullrequest:write"],
          tokenType: "bearer",
        });

      const result = await service.createPullRequest({
        owner: "maccheroni",
        repositoryName: "best-repo",
        branchName: mockedCreatePullRequestResponse.source.branch.name,
        baseBranchName: mockedCreatePullRequestResponse.destination.branch.name,
        pullRequestTitle: mockedCreatePullRequestResponse.title,
        pullRequestBody: "description for my pull request",
        repositoryGroupName: "ab-2",
      });

      const expectedResult = {
        url: "https://bitbucket.org/ab-2/best-repo/pull-requests/2",
        number: 2,
      };

      expect(spyOnRefreshToken).toHaveBeenCalledTimes(1);
      expect(spyOnCreatePullRequestFromRequest).toBeCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });
});
