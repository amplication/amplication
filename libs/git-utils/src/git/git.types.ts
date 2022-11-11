import { registerEnumType } from "@nestjs/graphql";
import { GithubFile } from "./dto/github-file.dto";
import { RemoteGitOrganization } from "./dto/remote-git-organization.dto";
import {
  RemoteGitRepos,
  RemoteGitRepository,
} from "./dto/remote-git-repository";

export type PrModule = {
  path: string;
  code: string | null;
};

export enum EnumGitOrganizationType {
  User = "User",
  Organization = "Organization",
}

registerEnumType(EnumGitOrganizationType, {
  name: "EnumGitOrganizationType",
});

export enum EnumGitProvider {
  Github = "Github",
}

registerEnumType(EnumGitProvider, {
  name: "EnumGitProvider",
});

export interface GitResourceMeta {
  serverPath: string;
  adminUIPath: string;
}

export interface GitResourceMeta {
  serverPath: string;
  adminUIPath: string;
}

export interface GitClient {
  createUserRepository(
    installationId: string,
    owner: string,
    name: string,
    isPublic: boolean
  ): Promise<RemoteGitRepository>;

  createOrganizationRepository(
    installationId: string,
    owner: string,
    name: string,
    isPublic: boolean
  ): Promise<RemoteGitRepository>;

  getOrganizationRepos(
    installationId: string,
    limit: number,
    page: number
  ): Promise<RemoteGitRepos>;

  isRepoExist(installationId: string, name: string): Promise<boolean>;

  getGitInstallationUrl(workspaceId: string): Promise<string>;

  deleteGitOrganization(installationId: string): Promise<boolean>;

  getGitRemoteOrganization(
    installationId: string
  ): Promise<RemoteGitOrganization>;

  getFile(
    userName: string,
    repoName: string,
    path: string,
    baseBranchName: string,
    installationId: string
  ): Promise<GithubFile>;

  createPullRequest(
    userName: string,
    repoName: string,
    modules: PrModule[],
    commitName: string,
    commitMessage: string,
    commitDescription: string,
    baseBranchName: string,
    installationId: string,
    meta: GitResourceMeta
  ): Promise<string>;
}
