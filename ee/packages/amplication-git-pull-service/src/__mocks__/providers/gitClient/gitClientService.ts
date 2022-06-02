export const mockGitClientService = jest.fn().mockReturnValue(() => ({
  clone: jest.mock('simple-git', () => {
    const mockedGit = {
      clone: jest.fn(),
    };
    return jest.fn(() => mockedGit);
  }),
  pull: jest.mock('simple-git', () => {
    const mockedGit = {
      pull: jest.fn(),
    };
    return jest.fn(() => mockedGit);
  }),
  checkout: jest.mock('simple-git', () => {
    const mockedGit = {
      checkout: jest.fn(),
    };
    return jest.fn(() => mockedGit);
  }),
  merge: jest.mock('simple-git', () => {
    const mockedGit = {
      merge: jest.fn(),
    };
    return jest.fn(() => mockedGit);
  }),
}));
