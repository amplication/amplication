import { GitClientService } from "./git.service";
import { ILogger } from "@amplication/util/logging";
import { GitCli } from "./git-cli";
import { GitFactory } from "./git-factory";
import { GitProvider } from "../git-provider.interface";

jest.mock("./git-cli");
jest.mock("simple-git");
jest.mock("./git-factory");

const logger: ILogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  child: jest.fn(() => {
    return logger;
  }),
};

const amplicationBotOrIntegrationApp = { id: "2", login: "amplication[bot]" };
const amplicationGitUser = {
  name: "amplication[bot]",
  email: "bot@amplication.com",
};
const amplicationGitUserAuthor = `${amplicationGitUser.name} <${amplicationGitUser.email}>`;

describe("GitClientService", () => {
  let service: GitClientService;
  const mockedGitLog = jest.fn();
  const mockedGitDiff = jest.fn();

  const mockedGitCli: GitCli = {
    gitAuthorUser: amplicationGitUserAuthor,
    log: mockedGitLog,
    checkout: jest.fn(),
    reset: jest.fn(),
    push: jest.fn(),
    resetState: jest.fn(),
    diff: mockedGitDiff,
  } as unknown as GitCli;

  const mockedAmplicationBotIdentity = jest
    .fn()
    .mockResolvedValue(amplicationBotOrIntegrationApp);

  beforeEach(() => {
    const mockedProvider: GitProvider = {
      getAmplicationBotIdentity: mockedAmplicationBotIdentity,
    } as unknown as GitProvider;

    jest.spyOn(GitFactory, "getProvider").mockResolvedValue(mockedProvider);

    service = new GitClientService();

    service.create(null, null, logger);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("when there are no commits from amplication <bot@amplication.com> and there are commits for amplication[bot] (or amplication provider integration)", () => {
    beforeEach(() => {
      mockedGitLog.mockImplementation((author, maxCount) => {
        if (author === amplicationGitUserAuthor)
          return {
            all: [],
            total: 0,
            latest: null,
          };
        return {
          all: [
            {
              hash: "sghfsjfdsfd34234",
              author_name: amplicationBotOrIntegrationApp.login,
              author_email: "monster@spagetti.com",
            },
            {
              hash: "hhfdfdgdf34234gd",
              author_name: amplicationBotOrIntegrationApp.login,
              author_email: "monster@spagetti.com",
            },
          ],
          total: 2,
          latest: {
            hash: "sghfsjfdsfd34234",
            author_name: amplicationBotOrIntegrationApp.login,
            author_email: "monster@spagetti.com",
          },
        };
      });
    });

    it("should return the diff of the latest commit of amplication[bot] (or amplication provider integration)", async () => {
      await service.preCommitProcess({
        branchName: "amplication",
        gitCli: mockedGitCli,
      });

      expect(mockedGitLog).toBeCalledTimes(2);
      expect(mockedGitDiff).toBeCalledWith("sghfsjfdsfd34234");
    });
  });

  describe("when there is not amplication[bot] (or amplication provider integration)", () => {
    beforeEach(() => {
      mockedAmplicationBotIdentity.mockResolvedValue(null);
    });

    it("should return the diff of the latest commit of amplication <bot@amplication.com>", async () => {
      mockedGitLog.mockResolvedValue({
        all: [
          {
            hash: "sghfsjfdsfd34234",
            author_name: "amplication",
            author_email: "bot@amplication.com",
          },
          {
            hash: "hhfdfdgdf34234gd",
            author_name: amplicationGitUserAuthor,
            author_email: "bot@amplication.com",
          },
        ],
        total: 2,
        latest: {
          hash: "sghfsjfdsfd34234",
          author_name: amplicationGitUserAuthor,
          author_email: "bot@amplication.com",
        },
      });

      await service.preCommitProcess({
        branchName: "amplication",
        gitCli: mockedGitCli,
      });

      expect(mockedGitLog).toBeCalledTimes(1);
      expect(mockedGitDiff).toBeCalledWith("sghfsjfdsfd34234");
    });

    it("should not call the gitlog for author amplication[bot] (or amplication provider integration)", async () => {
      await service.preCommitProcess({
        branchName: "amplication",
        gitCli: mockedGitCli,
      });

      expect(mockedGitLog).toHaveBeenCalledTimes(1);

      expect(mockedGitLog).toBeCalledWith(amplicationGitUserAuthor, 1);
    });
  });
});
