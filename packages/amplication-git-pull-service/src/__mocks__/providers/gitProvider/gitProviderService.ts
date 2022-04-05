import { MOCK_ACCESS_TOKEN } from "../../stubs/gitClient.stub";

export const mockGitHostProviderService = jest.fn().mockImplementation(() => ({
  createInstallationAccessToken: jest.fn().mockImplementation(() => ({
    data: {
      accessToken: MOCK_ACCESS_TOKEN,
    },
  })),
}));
