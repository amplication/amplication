import { GithubBranchFactory } from '../providers/github-branch.factory';
import { mock } from 'jest-mock-extended';
import { ConfigService } from '@nestjs/config';
import {
  GITHUB_APP_APP_ID_VAR,
  GITHUB_APP_PRIVATE_KEY_VAR
} from '../providers/github.service';
import { GitProviderBranch } from '../providers/github-branch.provider';

const APP_ID = 230968;
const APP_PEM = '';
const INSTALLATION_ID = 28672211;
const OWNER = 'matan-test-org';
const REPO = 'integration-test';
const BRANCH = 'amplication';

let githubBranchFactory: GithubBranchFactory;
let client: GitProviderBranch;
beforeAll(() => {
  const configService = mock<ConfigService>();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  configService.get.calledWith(GITHUB_APP_APP_ID_VAR).mockReturnValue(APP_ID);
  configService.get
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    .calledWith(GITHUB_APP_PRIVATE_KEY_VAR)
    .mockReturnValue(APP_PEM);

  githubBranchFactory = new GithubBranchFactory(configService);
});

beforeEach(async () => {
  client = await githubBranchFactory.getClient(
    INSTALLATION_ID.toString(),
    OWNER,
    REPO,
    BRANCH
  );
  await client.createRepository(false);
});

afterEach(async () => {
  await client.deleteRepository();
});

describe.skip('GitHub Branch provider', () => {
  test('get branch - no branch', async () => {
    const branch = await client.getBranch();
    expect(branch).toBeNull();
  });

  test('delete branch - no branch', async () => {
    const deleted = await client.deleteBranch();
    expect(deleted).toBe(false);
  });

  test('create and delete branch', async () => {
    await client.createBranch();

    const deleted = await client.deleteBranch();
    expect(deleted).toBe(true);

    const branch = await client.getBranch();
    expect(branch).toBeNull();
  });

  test('create and get branch', async () => {
    const branch_url = await client.createBranch();
    expect(branch_url).toBeDefined();
    expect(branch_url.length).toBeGreaterThan(1);

    const branch = await client.getBranch();
    expect(branch).toBeDefined();
    expect(branch.headCommit).toBeDefined();
    expect(branch.headCommit.length).toBeGreaterThan(1);
  });

  test('create and push commit', async () => {
    await client.createBranch();
    const commit = await client.commit('test commit', [
      {
        path: 'test.json',
        content: `{"test":"json"}`
      }
    ]);
    const { headCommit: remoteCommit } = await client.getBranch();
    expect(commit).toBe(remoteCommit);
  });

  test('create and push commit', async () => {
    await client.createBranch();
    const commit = await client.commit('test commit', [
      {
        path: 'test.json',
        content: `{"test":"json"}`
      }
    ]);
    const { headCommit: remoteCommit } = await client.getBranch();
    expect(commit).toBe(remoteCommit);
  });

  test('get repository default branch', async () => {
    const defaultBranch = await client.getDefault();
    expect(defaultBranch).toBe('main');
  });

  test('set branch protection rules', async () => {
    await client.createBranch();
    await client.setProtectionRules();

    const res = await client.deleteBranch();
    expect(res).toBe('main');
  });
});
