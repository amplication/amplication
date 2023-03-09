import { LinksMetadata } from "../../types";

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

export interface WorkspaceMembership {
  links: {
    self: LinksMetadata;
  };
  user: Account;
  workspace: Workspace;
}

export interface Workspace {
  links: {
    avatar: LinksMetadata;
    html: LinksMetadata;
    members: LinksMetadata;
    owners: LinksMetadata;
    projects: LinksMetadata;
    repositories: LinksMetadata;
    snippets: LinksMetadata;
    self: LinksMetadata;
  };
  uuid: string;
  name: string;
  slug: string;
  is_private: boolean;
  created_on: string;
  updated_on: string;
}

// https://developer.atlassian.com/cloud/bitbucket/rest/api-group-repositories/#api-repositories-workspace-get
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
    self: LinksMetadata;
  };
  uuid: string;
  full_name: string; // The concatenation of the repository owner's username and the slugified name, e.g. "evzijst/interruptingcow". This is the same string used in Bitbucket URLs.
  is_private: boolean;
  owner: Account;
  name: string;
  project: Project;
  mainbranch: Branch;
}

interface Project {
  key: string;
  owner: string;
  name: string;
}

interface Branch {
  merge_strategies: string[];
  default_merge_strategy: string;
}
