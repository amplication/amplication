/* eslint-disable @typescript-eslint/naming-convention */
import { Request } from "express";
import { Account, User, UserRole, Workspace } from "../../models";

export type GitHubRequest = Request & { isNew: boolean | undefined };

export interface AuthProfile extends AuthProfileCustomClaims {
  /**
   * The user's unique id
   */
  sub: string;
  email: string;
  nickname: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

interface AuthProfileCustomClaims {
  /**
   * [Custom claim] The user's origin (e.g. github, google, sso integration, db, etc.)
   */
  identityOrigin?: string;
  /**
   * [Custom claim] The number of times this user has logged in in the IdP.
   */
  loginsCount?: number;
}

export type AuthUser = User & {
  account: Account;
  workspace: Workspace;
  userRoles: UserRole[];
};

export type BootstrapPreviewUser = {
  user: AuthUser;
  workspaceId: string;
  projectId: string;
  resourceId: string;
};

export type CreatePreviewServiceSettingsArgs = {
  projectId: string;
  name: string;
  description: string;
  adminUIPath: string;
  serverPath: string;
  generateAdminUI: boolean;
  generateGraphQL: boolean;
  generateRestApi: boolean;
};
