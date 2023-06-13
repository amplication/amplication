/* eslint-disable @typescript-eslint/naming-convention */
import { Request } from "express";

export type GitHubRequest = Request & { isNew: boolean | undefined };

export interface AuthProfile {
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
