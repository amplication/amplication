import { parse } from "path";
import { BitBucketService } from "./bitbucket.service";
import { EnumGitProvider } from "../../types";
import { ILogger } from "@amplication/util/logging";
import * as requests from "./requests";
import {
  TreeEntry,
  PaginatedTreeEntry,
  Commit,
  Branch,
  PullRequestComment,
} from "./bitbucket.types";

jest.mock("fs");

const logger: ILogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  child: jest.fn(),
};

describe("bitbucket.service", () => {
  let service: BitBucketService;
  beforeEach(() => {
    service = new BitBucketService(
      {
        provider: EnumGitProvider.Bitbucket,
        providerOrganizationProperties: {
          accessToken: "my-token",
        },
      },
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
        expect(e.message).toBe("Missing baseBranchName");
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

      const spyOnGetFileRequest = jest
        .spyOn(requests, "getFileMetaRequest")
        .mockResolvedValue(mockedGetFileMetaResponse);

      expect.assertions(2);
      try {
        await service.getFile({
          path: "tests/",
          owner: "mr-bucket",
          repositoryName: "my-repo",
          baseBranchName: "main",
        });
      } catch (e) {
        expect(e.message).toBe(
          "Path points to a directory, please provide a file path"
        );
      }
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

      const result = await service.getFile({
        path: "tests/__init__.py",
        owner: "mr-bucket",
        repositoryName: "my-repo",
        baseBranchName: "main",
      });

      const expectedResult = {
        content: await (
          await spyOnGetFileRequest.mock.results[0].value
        ).toString("utf-8"),
        htmlUrl: mockedGetFileResponse.commit.links.html.href,
        name: parse(mockedGetFileResponse.path).name,
        path: mockedGetFileResponse.path,
      };

      expect(spyOnGetFileMetaRequest).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("createCommit", () => {
    it("throws when git group name wasn't provider", async () => {
      expect.assertions(1);
      try {
        await service.createCommit({
          owner: "maccheroni",
          commitMessage: "commit message",
          author: {
            name: "Spaghetti Monster",
            email: "monster@spagetti.com",
          },
          files: [{ path: "path/file.me", content: "content" }],
          branchName: "master",
          repositoryName: "myrepo",
        });
      } catch (e) {
        expect(e.message).toBe("Missing gitGroupName");
      }
    });

    it("create commit with a provided author and the last commit hash", async () => {
      const mockedGetLastCommitResponse = {
        type: "commit",
        hash: "bc3412a0a22c5e06f8350b841d1d5f91304e5e58",
        date: "2023-03-18T14:05:31+00:00",
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
        message: "new-test.txt created online with Bitbucket",
        summary: {
          type: "rendered",
          raw: "new-test.txt created online with Bitbucket",
          markup: "markdown",
          html: "<p>new-test.txt created online with Bitbucket</p>",
        },
        links: {
          self: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/bc3412a0a22c5e06f8350b841d1d5f91304e5e58",
          },
          html: {
            href: "https://bitbucket.org/ab-2/best-repo/commits/bc3412a0a22c5e06f8350b841d1d5f91304e5e58",
          },
          diff: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/diff/bc3412a0a22c5e06f8350b841d1d5f91304e5e58",
          },
          approve: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/bc3412a0a22c5e06f8350b841d1d5f91304e5e58/approve",
          },
          comments: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/bc3412a0a22c5e06f8350b841d1d5f91304e5e58/comments",
          },
          statuses: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/commit/bc3412a0a22c5e06f8350b841d1d5f91304e5e58/statuses",
          },
          patch: {
            href: "https://api.bitbucket.org/2.0/repositories/ab-2/best-repo/patch/bc3412a0a22c5e06f8350b841d1d5f91304e5e58",
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
        rendered: {
          message: {
            type: "rendered",
            raw: "new-test.txt created online with Bitbucket",
            markup: "markdown",
            html: "<p>new-test.txt created online with Bitbucket</p>",
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

      const spyOnGetLastCommitRequest = jest
        .spyOn(requests, "getLastCommitRequest")
        .mockResolvedValue(mockedGetLastCommitResponse);

      const spyOnCreateCommitRequest = jest
        .spyOn(requests, "createCommitRequest")
        .mockResolvedValue({ status: 201 });

      await service.createCommit({
        owner: "maccheroni",
        author: {
          name: "Spaghetti Monster",
          email: "monster@spagetti.com",
        },
        commitMessage: "commit message",
        files: [
          { path: "server/file1.txt", content: "New content of file1.txt" },
          { path: "admin/file2.txt", content: "New content of file2.txt" },
        ],
        branchName: "master",
        repositoryName: "my-repo",
        gitGroupName: "my-group",
      });

      expect(spyOnGetLastCommitRequest).toHaveBeenCalledTimes(1);
      expect(spyOnCreateCommitRequest).toHaveBeenCalledTimes(1);
      expect(spyOnCreateCommitRequest).toHaveBeenCalledWith(
        "my-group",
        "my-repo",
        {
          message: "commit message",
          author: "Spaghetti Monster <monster@spagetti.com>",
          parents: [mockedGetLastCommitResponse.hash],
          branch: { name: "master" },
          "server/file1.txt": "New content of file1.txt",
          "admin/file2.txt": "New content of file2.txt",
        },
        "my-token"
      );
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
        expect(e.message).toBe("Missing gitGroupName");
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

      const result = await service.getFirstCommitOnBranch({
        owner: "maccheroni",
        branchName: "master",
        repositoryName: mockedGetFirstCommitResponse.repository.name,
        gitGroupName:
          mockedGetFirstCommitResponse.repository.full_name.split("/")[0],
      });

      const expected = { sha: mockedGetFirstCommitResponse.hash };

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
          token: "my-token",
        });
      } catch (e) {
        expect(e.message).toBe("Missing gitGroupName");
      }
    });
    it("returns the clone url", async () => {
      const result = await service.getCloneUrl({
        owner: "maccheroni",
        repositoryName: "myrepo",
        gitGroupName: "mygroup",
        token: "my-token",
      });

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
        expect(e.message).toBe("Missing gitGroupName");
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

      const result = await service.getBranch({
        owner: "maccheroni",
        branchName: "master",
        repositoryName: "my-repo",
        gitGroupName: "my-group",
      });

      const expectedResult = {
        name: "master",
        sha: "bbfe95276c624e76c50aa640e7dba4af31b84961",
      };

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
        expect(e.message).toBe("Missing gitGroupName");
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

      const spyOnGetBranchRequest = jest
        .spyOn(requests, "createBranchRequest")
        .mockResolvedValue(mockedCreateBranchResponse);

      const result = await service.createBranch({
        owner: "maccheroni",
        repositoryName: "my-repo",
        branchName: "amit-test",
        pointingSha: "bbfe95276c624e76c50aa640e7dba4af31b84961",
        gitGroupName: "my-group",
      });

      const expectedResult = {
        name: mockedCreateBranchResponse.name,
        sha: mockedCreateBranchResponse.target.hash,
      };

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
        expect(e.message).toBe("Missing gitGroupName");
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

      await service.createPullRequestComment({
        where: {
          issueNumber: 1,
          owner: "maccheroni",
          repositoryName: "my-repo",
          gitGroupName: "my-group",
        },
        data: { body: "this is my comment for the pull request" },
      });

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
});
