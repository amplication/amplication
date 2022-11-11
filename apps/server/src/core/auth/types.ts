import { Request } from 'express';

export type GitHubRequest = Request & { isNew: boolean | undefined };
