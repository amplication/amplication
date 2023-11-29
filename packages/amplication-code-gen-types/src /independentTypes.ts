export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSONObject: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type Action = {
  createdAt: string;
  id: string;
  steps?: Maybe<ActionStep[]>;
};

export type ActionLog = {
  createdAt: string;
  id: string;
  level: EnumActionLogLevel;
  message: string;
  meta: Record<string, any>;
};

export type ActionStep = {
  completedAt?: Maybe<string>;
  createdAt: string;
  id: string;
  logs?: Maybe<ActionLog[]>;
  message: string;
  name: string;
  status: EnumActionStepStatus;
};

export type AdminUiSettings = {
  adminUIPath: string;
  generateAdminUI: boolean;
};

export type AdminUiSettingsUpdateInput = {
  adminUIPath?: Maybe<string>;
  generateAdminUI?: Maybe<boolean>;
};

export type ApiToken = {
  createdAt: string;
  id: string;
  lastAccessAt: string;
  name: string;
  previewChars: string;
  token?: Maybe<string>;
  updatedAt: string;
  userId: string;
};

export type ApiTokenCreateInput = {
  name: string;
};

export type Auth = {
  token: string;
};

export type AuthorizeResourceWithGitResult = {
  url: string;
};

export type Block = {
  blockType: EnumBlockType;
  createdAt: string;
  description?: Maybe<string>;
  displayName: string;
  id: string;
  lockedAt?: Maybe<string>;
  lockedByUser: User[];
  lockedByUserId?: Maybe<string>;
  parentBlock?: Maybe<Block>;
  resource?: Maybe<Resource>;
  updatedAt: string;
  versionNumber?: Maybe<number>;
  versions?: Maybe<BlockVersion[]>;
};
