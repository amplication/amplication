export interface IGitClient {
  clone: (
    provider: string,
    repositoryOwner: string,
    repositoryName: string,
    branch: string,
    commit: string,
    pushedAt: Date,
    baseDir: string,
    installationId: string,
    accessToken: string
  ) => Promise<void>;
  pull: (
    remote: string,
    branch: string,
    commit: string,
    baseDir: string
  ) => Promise<void>;
}
