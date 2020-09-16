import { Octokit } from '@octokit/rest';
import { GitHubStrategy, GITHUB_USER_EMAILS_ROUTE } from './github.strategy';
import { AuthService } from './auth.service';
import { StrategyOptions, Profile } from 'passport-github';

const EXAMPLE_ACCESS_TOKEN = 'EXAMPLE_ACCESS_TOKEN';
const EXAMPLE_REFRESH_TOKEN = 'EXAMPLE_REFRESH_TOKEN';
const EXAMPLE_EMAIL = 'example@example.com';
const EXAMPLE_PROFILE: Profile = {
  _raw: '',
  _json: {},
  provider: 'github',
  profileUrl: 'https://github.com/example',
  id: 'example',
  displayName: 'Example User',
  emails: [
    {
      value: EXAMPLE_EMAIL
    }
  ]
};
const EXAMPLE_USER = {
  account: {
    id: 'EXAMPLE_ACCOUNT_ID'
  }
};
const EXAMPLE_USER_WITH_GITHUB_ID = {
  ...EXAMPLE_USER,
  githubId: EXAMPLE_PROFILE.id
};
const GET_AUTH_USER_WHERE = {
  account: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    OR: [{ githubId: EXAMPLE_PROFILE.id }, { email: EXAMPLE_EMAIL }]
  }
};

jest.mock('@octokit/rest');

Octokit.prototype.request = jest.fn(() => ({
  data: [{ email: EXAMPLE_EMAIL }]
}));

const getAuthUserMock = jest.fn();
const createGitHubUserMock = jest.fn(() => EXAMPLE_USER_WITH_GITHUB_ID);
const updateGitHubUserMock = jest.fn(() => EXAMPLE_USER_WITH_GITHUB_ID);

describe('GithubStrategy', () => {
  let strategy: GitHubStrategy;

  beforeEach(async () => {
    jest.clearAllMocks();
    const authService = {
      getAuthUser: getAuthUserMock,
      createGitHubUser: createGitHubUserMock,
      updateGitHubUser: updateGitHubUserMock
    } as unknown;
    const options: StrategyOptions = {
      clientID: 'EXAMPLE_CLIENT_ID',
      clientSecret: 'EXAMPLE_CLIENT_SECRET'
    };

    strategy = new GitHubStrategy(authService as AuthService, options);
  });

  test('new user', async () => {
    getAuthUserMock.mockImplementation(() => null);
    expect(
      await strategy.validate(
        EXAMPLE_ACCESS_TOKEN,
        EXAMPLE_REFRESH_TOKEN,
        EXAMPLE_PROFILE
      )
    ).toBe(EXAMPLE_USER_WITH_GITHUB_ID);
    expect(getAuthUserMock).toBeCalledTimes(1);
    expect(getAuthUserMock).toBeCalledWith(GET_AUTH_USER_WHERE);
    expect(createGitHubUserMock).toBeCalledTimes(1);
    expect(createGitHubUserMock).toBeCalledWith(EXAMPLE_PROFILE);
    expect(Octokit).toBeCalledWith({ auth: EXAMPLE_ACCESS_TOKEN });
    expect(Octokit).toBeCalledTimes(1);
    expect(Octokit.prototype.request).toBeCalledTimes(1);
    expect(Octokit.prototype.request).toBeCalledWith(GITHUB_USER_EMAILS_ROUTE);
  });
  test('unconnected existing user', async () => {
    getAuthUserMock.mockImplementation(() => EXAMPLE_USER);
    expect(
      await strategy.validate(
        EXAMPLE_ACCESS_TOKEN,
        EXAMPLE_REFRESH_TOKEN,
        EXAMPLE_PROFILE
      )
    ).toBe(EXAMPLE_USER_WITH_GITHUB_ID);
    expect(getAuthUserMock).toBeCalledTimes(1);
    expect(getAuthUserMock).toBeCalledWith(GET_AUTH_USER_WHERE);
    expect(updateGitHubUserMock).toBeCalledTimes(1);
    expect(updateGitHubUserMock).toBeCalledWith(EXAMPLE_USER, EXAMPLE_PROFILE);
    expect(Octokit).toBeCalledWith({ auth: EXAMPLE_ACCESS_TOKEN });
    expect(Octokit).toBeCalledTimes(1);
    expect(Octokit.prototype.request).toBeCalledTimes(1);
    expect(Octokit.prototype.request).toBeCalledWith(GITHUB_USER_EMAILS_ROUTE);
  });
  test('connected exiting user', async () => {
    getAuthUserMock.mockImplementation(() => EXAMPLE_USER_WITH_GITHUB_ID);
    expect(
      await strategy.validate(
        EXAMPLE_ACCESS_TOKEN,
        EXAMPLE_REFRESH_TOKEN,
        EXAMPLE_PROFILE
      )
    ).toBe(EXAMPLE_USER_WITH_GITHUB_ID);
    expect(getAuthUserMock).toBeCalledTimes(1);
    expect(getAuthUserMock).toBeCalledWith(GET_AUTH_USER_WHERE);
    expect(Octokit).toBeCalledWith({ auth: EXAMPLE_ACCESS_TOKEN });
    expect(Octokit).toBeCalledTimes(1);
    expect(Octokit.prototype.request).toBeCalledTimes(1);
    expect(Octokit.prototype.request).toBeCalledWith(GITHUB_USER_EMAILS_ROUTE);
  });
});
