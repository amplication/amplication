import { mock } from "jest-mock-extended";
import {
  GithubConfig,
  GithubFactory,
  GitProvider,
} from "@amplication/git-utils";
import { CommitsService } from "../core/commit/commits.service";
import { AmplicationLogger } from "@amplication/nest-logger-module";

//TODO: Add environments to GitHub workflow tests
const APP_ID = "230968";
const APP_PEM = "";
const INSTALLATION_ID = 28672211;
const OWNER = "matan-test-org";
const REPO = "integration-test";

let githubFactory: GithubFactory;
let client: GitProvider;
let commitService: CommitsService;

jest.setTimeout(100000);

beforeAll(async () => {
  githubFactory = new GithubFactory(new GithubConfig(APP_ID, APP_PEM));
  client = await githubFactory.getClient(
    INSTALLATION_ID.toString(),
    OWNER,
    REPO
  );
  await client.deleteRepository();
});

beforeEach(async () => {
  client = await githubFactory.getClient(
    INSTALLATION_ID.toString(),
    OWNER,
    REPO
  );
  await client.createRepository(false);
  const amplicationLogger = mock<AmplicationLogger>();
  amplicationLogger.info.calledWith((...str) => {
    console.log(str);
  });
  amplicationLogger.debug.calledWith((...str) => {
    console.log(str);
  });

  commitService = new CommitsService(githubFactory, amplicationLogger);
});

afterEach(async () => {
  client = await githubFactory.getClient(
    INSTALLATION_ID.toString(),
    OWNER,
    REPO
  );
  await client.createRepository(false);
});

afterAll(async () => {
  client = await githubFactory.getClient(
    INSTALLATION_ID.toString(),
    OWNER,
    REPO
  );
  await client.deleteRepository();
});

describe.skip("add commit repository", () => {
  test("first commit create pull request and branch", async () => {
    const inputBuild = "build-id";
    const inputCommit = "commit-id";

    const { buildId, commit, pullRequest, pullRequestComment } =
      await commitService.addCommitToRepository(
        INSTALLATION_ID.toString(),
        {
          buildId: inputBuild,
          resourceId: "resource-id",
          resourceName: "",
          commitId: inputCommit,
          owner: OWNER,
          repo: REPO,
        },
        "test-1",
        [
          {
            path: "src/test",
            content: "test",
          },
        ]
      );

    expect(buildId).toEqual(inputBuild);
    expect(commit).toBeTruthy();
    expect(commit.sha).toBeTruthy();
    expect(Date.parse(commit.timestamp)).toBeLessThanOrEqual(
      new Date().getTime()
    );
    expect(pullRequest).toBeTruthy();
    expect(pullRequest.number).toBeGreaterThan(0);
    expect(pullRequest.created).toEqual(true);
    expect(pullRequest.url).toBeTruthy();
    expect(pullRequestComment).toBeTruthy();
    expect(pullRequestComment.url).toBeTruthy();
  });

  test("second commit add commit to branch and add new comment", async () => {
    const inputBuild = "build-id";
    const inputCommit = "commit-id";

    const firstCommit = await commitService.addCommitToRepository(
      INSTALLATION_ID.toString(),
      {
        buildId: inputBuild,
        resourceId: "resource-id",
        resourceName: "",
        commitId: inputCommit,
        owner: OWNER,
        repo: REPO,
      },
      "test-1",
      [
        {
          path: "src/test",
          content: "test",
        },
      ]
    );

    const secondCommit = await commitService.addCommitToRepository(
      INSTALLATION_ID.toString(),
      {
        buildId: inputBuild,
        resourceId: "resource-id",
        resourceName: "",
        commitId: inputCommit,
        owner: OWNER,
        repo: REPO,
      },
      "test-1",
      [
        {
          path: "src/test",
          content: "test2",
        },
      ]
    );

    expect(secondCommit.pullRequest.created).toEqual(false);
    expect(secondCommit.pullRequestComment.url).toBeTruthy();
    expect(secondCommit.pullRequestComment.url).not.toEqual(
      firstCommit.pullRequestComment.url
    );
  });
});
