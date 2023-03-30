import { GitClientService } from "./git.service";
// test the GitClientService class
import { ILogger } from "@amplication/util/logging";
import { SimpleGit } from "simple-git";
import { GitClient } from "./git-client";
import { GitFactory } from "./git-factory";
import { GitProvider } from "../git-provider.interface";

jest.mock("./git-client");
jest.mock("simple-git");
jest.mock("./git-factory");

const logger: ILogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  child: jest.fn(),
};
describe("GitClientService", () => {
  let service: GitClientService;
  const mockedGitLog = jest.fn();
  const mockedGitDiff = jest.fn();

  const mockedSimpleGit: SimpleGit = {
    log: mockedGitLog,
    checkout: jest.fn(),
    reset: jest.fn(),
    push: jest.fn(),
    resetState: jest.fn(),
    diff: mockedGitDiff,
  } as unknown as SimpleGit;

  const mockedGitClient: GitClient = {
    git: mockedSimpleGit,
  } as unknown as GitClient;

  beforeEach(() => {
    const mockedProvider: GitProvider = {
      getCurrentGitUser: jest
        .fn()
        .mockResolvedValue({ id: "2", login: "amplication[bot]" }),
    } as unknown as GitProvider;
    jest.spyOn(GitFactory, "getProvider").mockResolvedValue(mockedProvider);
    service = new GitClientService();

    service.create(null, null, logger);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return the diff from the github application bot latest commit when there are no commits from amplication <bot@amplication.com>", async () => {
    mockedGitLog.mockImplementation((args) => {
      if (args["--author"] === "amplication <bot@amplication.com>")
        return {
          all: [],
          total: 0,
          latest: null,
        };
      return {
        all: [
          {
            hash: "sghfsjfdsfd34234",
            author_name: "Spaghetti Monster",
            author_email: "monster@spagetti.com",
          },
          {
            hash: "hhfdfdgdf34234gd",
            author_name: "Spaghetti Monster",
            author_email: "monster@spagetti.com",
          },
        ],
        total: 2,
        latest: {
          hash: "sghfsjfdsfd34234",
          author_name: "Spaghetti Monster",
          author_email: "monster@spagetti.com",
        },
      };
    });

    await service.preCommitProcess({
      branchName: "amplication",
      gitClient: mockedGitClient,
    });

    expect(mockedGitLog).toBeCalledTimes(2);
    expect(mockedGitDiff).toBeCalledWith(["sghfsjfdsfd34234"]);
  });
});
