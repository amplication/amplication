import { parse } from "path";
import { BitBucketService } from "./bitbucket.service";
import { EnumGitProvider } from "../../types";
import { ILogger } from "@amplication/util/logging";
import * as requests from "./requests";
import { TreeEntry, PaginatedTreeEntry } from "./bitbucket.types";

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
        providerOrganizationProperties: {},
      },
      {
        clientId: "id",
        clientSecret: "secret",
      },
      logger
    );
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
});
