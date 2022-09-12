import { GithubFactory } from '../providers/github.factory';
import { mock } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';
import {
  GITHUB_APP_APP_ID_VAR,
  GITHUB_APP_PRIVATE_KEY_VAR
} from '../providers/github.service';
import { GitProvider } from 'src/providers/git-provider.interface';

//TODO: Add environments to GitHub workflow tests
const APP_ID = 230968;
const APP_PEM = "";
const INSTALLATION_ID = 28672211;
const OWNER = 'matan-test-org';
const REPO = 'integration-test';
const BRANCH = 'amplication';

let githubFactory: GithubFactory;
let client: GitProvider;

const COMMIT_MESSAGE = 'test commit'
const PULL_REQUEST__MESSAGE = 'PULL_REQUEST__MESSAGE'
const PULL_REQUEST_TITLE = 'PULL_REQUEST_TITLE'

const files= (value:string="json")=> [
  {
    path: 'test.json',
    content: `{"test":"${value}"}`
  }
]

const defaultBranch = async ():Promise<string> => {
  return await client.getDefaultBranchName()
}

const branchHeadCommit = async (branch:string):Promise<string> => {
  return (await client.getBranch(branch)).headCommit
}

const mainHeadCommit = async ():Promise<string> => {
  return (await branchHeadCommit(await defaultBranch()))
}

jest.setTimeout(10000)

beforeAll(async () => {
  const configService = mock<ConfigService>();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  configService.get.calledWith(GITHUB_APP_APP_ID_VAR).mockReturnValue(APP_ID);
  configService.get
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    .calledWith(GITHUB_APP_PRIVATE_KEY_VAR)
    .mockReturnValue(APP_PEM);

  githubFactory = new GithubFactory(configService);
  client = await githubFactory.getClient(
      INSTALLATION_ID.toString(),
      OWNER,
      REPO,
  );
  await client.deleteRepository();

});

beforeEach(async () => {
  client = await githubFactory.getClient(
      INSTALLATION_ID.toString(),
      OWNER,
      REPO,
  );
  await client.createRepository(false);
});

afterEach(async () => {
  await client.deleteRepository();
});

afterAll(async ()=>{
  client = await githubFactory.getClient(
      INSTALLATION_ID.toString(),
      OWNER,
      REPO,
  );
  await client.deleteRepository();
})

describe.skip("get branch",()=>{
  test('when there is no branch - return null', async () => {
    //ARRANGE

    //ACT
    const branch = await client.getBranch(BRANCH);

    //ASSERT
    expect(branch).toBeNull();
  });

  test('when there is a branch - return branch details', async () => {
    //ARRANGE
    await client.createBranch(BRANCH, await mainHeadCommit());

    //ACT
    const branch = await client.getBranch(BRANCH);

    //ASSERT
    expect(branch).toBeTruthy();
    expect(branch.headCommit).toBeTruthy();
  });
})

describe.skip("delete branch",()=> {
  test('when there is no branch - return false', async () => {
    //ARRANGE

    //ACT
    const deleted = await client.deleteBranch(BRANCH);

    //ASSERT
    expect(deleted).toBe(false);
  });

  test('when there is branch - return true', async () => {
    //ARRANGE
    await client.createBranch(BRANCH, await mainHeadCommit());

    //ACT
    const deleted = await client.deleteBranch(BRANCH);

    //ASSERT
    expect(deleted).toBe(true);
  });


  test('when there is branch - branch is deleted and get should return null', async () => {
    //ARRANGE
    await client.createBranch(BRANCH, await mainHeadCommit());

    //ACT
    await client.deleteBranch(BRANCH);

    //ASSERT
    const branch = await client.getBranch(BRANCH);
    expect(branch).toBeNull();
  });



})

describe.skip("create branch", ()=> {

  test('when created should return branch url', async () => {
    //ARRANGE

    //ACT
    const branch_url = await client.createBranch(BRANCH, await mainHeadCommit());

    //ASSERT
    expect(branch_url).toBeDefined();
    expect(branch_url.length).toBeGreaterThan(1);
  });

  test('when branch is already exists should return null', async () => {
    //ARRANGE
    await client.createBranch(BRANCH, await mainHeadCommit());

    //ACT
    const branch_url = await client.createBranch(BRANCH, await mainHeadCommit());

    //ASSERT
    expect(branch_url).toBeNull();
  });

})

describe.skip("commit",()=>{

  test('When a commit is created the branch head commit should be updated an be equal to the new commit SHA', async () => {
    //ARRANGE
    const headCommit = await mainHeadCommit()
    await client.createBranch(BRANCH, headCommit);

    //ACT
    const commitSHA = await client.commit(BRANCH,COMMIT_MESSAGE, files(),headCommit);

    //ASSERT
    const { headCommit: remoteCommit } = await client.getBranch(BRANCH);
    expect(commitSHA).not.toEqual(headCommit);
    expect(commitSHA).toEqual(remoteCommit);
  });

})

describe.skip("pull-request",()=> {

  test('should return pull request number ', async () => {
    //ARRANGE
    const main_branch = await defaultBranch()
    const headCommit = await branchHeadCommit(main_branch)
    await client.createBranch(BRANCH, headCommit);
    await client.commit(BRANCH, COMMIT_MESSAGE, files(), headCommit);
    //ACT
    const {number} = await client.createPullRequest(PULL_REQUEST_TITLE, PULL_REQUEST_TITLE, BRANCH, main_branch)

    //ASSERT
    expect(number).toBeGreaterThan(0)
  });

  test('When pull request already exists should throw exception', async () => {
    //ARRANGE
    const main_branch = await defaultBranch()
    const headCommit = await branchHeadCommit(main_branch)
    await client.createBranch(BRANCH, headCommit);
    await client.commit(BRANCH, COMMIT_MESSAGE, files(), headCommit);
    await client.createPullRequest(PULL_REQUEST_TITLE, PULL_REQUEST_TITLE, BRANCH, main_branch)

    //ACT
    const createPullRequestPromise = client.createPullRequest(PULL_REQUEST_TITLE, PULL_REQUEST_TITLE, BRANCH, main_branch)

    //ASSERT
    await expect(createPullRequestPromise).rejects
        .toThrow(new Error("Branch already has pull request"))
  });


  test('Pull request with conflict - should be created', async () => {
    //ARRANGE
    //first commit on main
    const main_branch = await defaultBranch()
    const headCommit = await branchHeadCommit(main_branch)
    const mainFirstCommitSha = await client.commit(main_branch, COMMIT_MESSAGE, files(), headCommit);

    //create ampilcation branch and change file
    await client.createBranch(BRANCH, headCommit);
    await client.commit(BRANCH, COMMIT_MESSAGE, files("change-on-branch"), mainFirstCommitSha);

    //update file on main
    await client.commit(main_branch, COMMIT_MESSAGE, files("change-on-main"), mainFirstCommitSha);

    //ACT
    const { url, number} = await client.createPullRequest(PULL_REQUEST_TITLE,PULL_REQUEST__MESSAGE,BRANCH,main_branch)

    //ASSERT
    expect(number).toBeGreaterThan(0)
    expect(url).toBe(`https://github.com/${OWNER}/${REPO}/pull/${number}`)
  });

  test("When branch has no new commits - should throw exception", async () => {
    //ARRANGE
    const main_branch = await defaultBranch()
    const headCommit = await branchHeadCommit(main_branch)
    await client.createBranch(BRANCH, headCommit);

    //ACT
    const createPullRequestPromise = client.createPullRequest(PULL_REQUEST_TITLE,PULL_REQUEST__MESSAGE,BRANCH,main_branch)

    //ASSERT
    await expect(createPullRequestPromise).rejects
        .toThrow(new Error(`There is no new commit in branch ${BRANCH}`))
  });

  test("open pull request when old pull request is closed", async ()=>{
    //ARRANGE
    const main_branch = await defaultBranch()
    const headCommit = await branchHeadCommit(main_branch)
    await client.createBranch(BRANCH, headCommit);
    await client.commit(BRANCH, COMMIT_MESSAGE, files(), headCommit);

    const {number} = await client.createPullRequest(PULL_REQUEST_TITLE,PULL_REQUEST__MESSAGE,BRANCH,main_branch)
    await client.updatePullRequest(number,false)
    //ACT
    const pullRequestMeta = await client.createPullRequest(PULL_REQUEST_TITLE,PULL_REQUEST__MESSAGE,BRANCH,main_branch)

    //ASSERT
    await expect(pullRequestMeta.number).not.toEqual(number)
  })


})

describe.skip("pull request comment", ()=>{


  test('When a comment is created it should return the comment URL', async () => {
    //ARRANGE
    const main_branch = await defaultBranch()
    const headCommit = await branchHeadCommit(main_branch)
    await client.createBranch(BRANCH, headCommit);
    await client.commit(BRANCH, COMMIT_MESSAGE, files(), headCommit);
    const { number} = await client.createPullRequest(PULL_REQUEST_TITLE,PULL_REQUEST__MESSAGE,BRANCH,main_branch)

    //ACT
    const result = await client.addPullRequestComment(number,"new comment")

    //ASSERT
    expect(result).toBeTruthy()
    expect(result).toMatch(new RegExp(`^https://github.com/${OWNER}/${REPO}/pull/${number}#issuecomment-`));

  });

  test('pull request does not exists - should throw exception', async () => {
    //ARRANGE

    //ACT
    const result = client.addPullRequestComment(1,"new comment")

    //ASSERT
    await expect(result).rejects.toThrow(new Error("Cannot add comment to pull request: pull request not found"))
  });
})

describe.skip("get opened pull request for branch", ()=>{

  test("exist", async ()=>{
    //ARRANGE
    const main_branch = await defaultBranch()
    const headCommit = await branchHeadCommit(main_branch)
    await client.createBranch(BRANCH, headCommit);
    await client.commit(BRANCH, COMMIT_MESSAGE, files(), headCommit);
    const pullRequestMeta = await client.createPullRequest(PULL_REQUEST_TITLE,PULL_REQUEST__MESSAGE,BRANCH,main_branch)

    //ACT
    const result = await client.getOpenedPullRequest(BRANCH)

    //ASSERT
    await expect(result).toEqual(pullRequestMeta)
  })

  test("no exist", async ()=>{
    //ARRANGE

    //ACT
    const result = await client.getOpenedPullRequest(BRANCH)

    //ASSERT
    await expect(result).toBeNull()
  })


  test("getOpenedPullRequest - Pull request is closed", async ()=>{
    //ARRANGE
    const main_branch = await defaultBranch()
    const headCommit = await branchHeadCommit(main_branch)
    await client.createBranch(BRANCH, headCommit);
    await client.commit(BRANCH, COMMIT_MESSAGE, files(), headCommit);

    const pullRequestMeta = await client.createPullRequest(PULL_REQUEST_TITLE,PULL_REQUEST__MESSAGE,BRANCH,main_branch)
    await client.updatePullRequest(pullRequestMeta.number,false)

    //ACT
    const result = await client.getOpenedPullRequest(BRANCH)

    //ASSERT
    await expect(result).toBeNull()
  })

})


