import { LinksMetadata } from "../../types";

enum AccessLevel {
  ADMIN = "admin",
  OWNER = "owner",
  MEMBER = "member",
  CONTRIBUTOR = "contributor",
}

enum PullRequestStat {
  OPEN = "OPEN",
  MERGED = "MERGED",
  DECLINED = "DECLINED",
  SUPERSEDED = "SUPERSEDED",
}

/**
 * These types are based on the Bitbucket API documentation:
 * https://developer.atlassian.com/cloud/bitbucket/rest
 * we use them to define the response types of the Bitbucket API in the requests.ts file
 * we took only the properties we need for the app
 */

export interface OAuth2 {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  state: string;
  scopes: string;
}

// https://developer.atlassian.com/cloud/bitbucket/rest/api-group-users/#api-user-get
export interface Account {
  links: {
    avatar: LinksMetadata;
  };
  created_on: string;
  display_name: string;
  username: string;
  uuid: string;
}

// https://developer.atlassian.com/cloud/bitbucket/rest/api-group-workspaces/#api-user-permissions-workspaces-get
export interface PaginatedWorkspaceMembership {
  size: number;
  page: number;
  pagelen: number;
  next: string;
  previous: string;
  values: WorkspaceMembership[];
}

interface WorkspaceMembership {
  user: Account;
  workspace: Workspace;
}

interface Workspace {
  links: {
    avatar: LinksMetadata;
    html: LinksMetadata;
  };
  uuid: string;
  name: string;
  slug: string;
}

/**
 * get repository/repositories: https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-get
 * create repository: https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-repo-slug-post
 **/
export interface PaginatedRepositories {
  size: number;
  page: number;
  pagelen: number;
  next: string;
  previous: string;
  values: Repository[];
}

export interface Repository {
  links: {
    html: LinksMetadata;
  };
  uuid: string;
  full_name: string; // The concatenation of the repository owner's username and the slugified name, e.g. "evzijst/interruptingcow". This is the same string used in Bitbucket URLs.
  is_private: boolean;
  owner: Account;
  name: string;
  project: Project;
  mainbranch: Branch;
  accessLevel: AccessLevel;
}

interface Project {
  key: string;
  owner: string;
  name: string;
}

export interface Branch {
  name: string;
  merge_strategies: string[];
  target: { hash: string };
  default_merge_strategy: string;
}

/**
 * https://developer.atlassian.com/cloud/bitbucket/rest/api-group-source/#api-repositories-workspace-repo-slug-src-commit-path-get
 */

export interface PaginatedTreeEntry {
  size: number;
  page: number;
  pagelen: number;
  next: string;
  previous: string;
  values: TreeEntry[];
}

export interface TreeEntry {
  type: string;
  path: string;
  content: string;
  commit: Commit;
}

export interface Commit {
  branch: Branch;
  repository: Repository;
  message: string;
  hash: string;
  links: {
    html: {
      href: string;
    };
  };
  author: {
    raw: string;
    user: Account;
  };
}

export interface CreateCommitData {
  message: string;
  author: string;
  parents: string[];
  branch: {
    name: string;
  };
  [path: string]: string | string[] | { name: string };
}

export interface PullRequestComment {
  pullRequest: PullRequest;
}

export interface PullRequest {
  id: number;
  title: string;
  author: Account;
  source: PullRequestEndpoint;
  destination: PullRequestEndpoint;
  state: PullRequestStat;
}

export interface PullRequestEndpoint {
  branch: Branch;
  repository: Repository;
  commit: Commit;
}

export interface Comment {
  id: number;
  content: {
    raw: string;
  };
  user: Account;
}
