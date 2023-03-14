import { LinksMetadata } from "../../types";

/**
 * These types are based on the Bitbucket API documentation:
 * https://developer.atlassian.com/cloud/bitbucket/rest
 * we use them to define the response types of the Bitbucket API in the requests.ts file
 * we took only the properties we need for the app
 */

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
  links: {
    self: LinksMetadata;
  };
  user: Account;
  workspace: Workspace;
}

interface Workspace {
  links: {
    avatar: LinksMetadata;
    self: LinksMetadata;
  };
  uuid: string;
  name: string;
  slug: string;
}
