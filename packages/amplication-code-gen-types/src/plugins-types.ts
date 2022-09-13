import {
  AppInfo,
  clientDirectories,
  DTOs,
  Entity,
  Module,
  Role,
  serverDirectories,
} from "./code-gen-types";
import winston from "winston";
import { Events } from "./plugin-events";

export interface EventParams {
  after: Module[];
}

export interface PrintResultType {
  code: string;
  map?: any;
  toString(): string;
}

export interface ContextUtil {
  skipDefaultBehavior: boolean;
  importStaticModules: (source: string, basePath: string) => Promise<Module[]>;
}
export interface DsgContext {
  appInfo: AppInfo;
  entities: Entity[];
  roles: Role[];
  modules: Module[];
  DTOs: DTOs;
  plugins: PluginMap;
  logger: winston.Logger;
  utils: ContextUtil;
  clientDirectories: clientDirectories;
  serverDirectories: serverDirectories;
}

export type PluginWrapper = (args: EventParams, func: () => void) => any;

export type PluginMap = {
  [K in EventNames]?: {
    before?: (<T>(context: DsgContext, params: Module[] | EventParams) => T)[];
    after?: (<T>(context: DsgContext, modules: Module[] | EventParams) => T)[];
  };
};

export enum EventNames {
  CreateEntityController = "CreateEntityController",
  CreateEntityControllerBase = "CreateEntityControllerBase",
  CreateAuthModules = "createAuthModules",
  CreateAdminModules = "createAdminModules",
  CreateServerDotEnv = "CreateServerDotEnv",
  CreateEntityService = "CreateEntityService",
  CreateEntityServiceBase = "CreateEntityServiceBase",
  CreateServerDockerCompose = "CreateServerDockerCompose",
  CreateServerDockerComposeDB = "CreateServerDockerComposeDB",
  CreatePrismaSchema = "CreatePrismaSchema",
}

export interface AmplicationPlugin {
  init?: (name: string, version: string) => void;
  register: () => Events;
}
