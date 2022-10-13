import type { Promisable } from "type-fest";
import winston from "winston";
import {
  clientDirectories,
  DTOs,
  Module,
  serverDirectories,
} from "./code-gen-types";
import { DSGResourceData } from "./dsg-resource-data";
import { Events } from "./plugin-events";

export interface EventParams {}

export type PluginBeforeEvent<T extends EventParams> = (
  dsgContext: DsgContext,
  eventParams: T
) => Promisable<T>;

export type PluginAfterEvent<T extends EventParams> = (
  dsgContext: DsgContext,
  eventParams: T,
  modules: Module[]
) => Promisable<Module[]>;

export interface PluginEventType<T extends EventParams> {
  before?: PluginBeforeEvent<T>;
  after?: PluginAfterEvent<T>;
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
export interface DsgContext extends DSGResourceData {
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
    before?: PluginBeforeEvent<EventParams>[];
    after?: PluginAfterEvent<EventParams>[];
  };
};

export enum EventNames {
  CreateEntityController = "CreateEntityController",
  CreateEntityControllerBase = "CreateEntityControllerBase",
  CreateAuthModules = "createAuthModules",
  CreateAdminModules = "createAdminModules",
  CreateServer = "CreateServer",
  CreateServerAppModule = "CreateServerAppModule",
  CreateServerDotEnv = "CreateServerDotEnv",
  CreateMessageBroker = "CreateMessageBroker",
  CreateMessageBrokerTopicsEnum = "CreateMessageBrokerTopicsEnum",
  CreateMessageBrokerNestJSModule = "CreateMessageBrokerNestJSModule",
  CreateMessageBrokerClientOptionsFactory = "CreateMessageBrokerClientOptionsFactory",
  CreateMessageBrokerService = "CreateMessageBrokerService",
  CreateMessageBrokerServiceBase = "CreateMessageBrokerServiceBase",
  CreateEntityService = "CreateEntityService",
  CreateEntityServiceBase = "CreateEntityServiceBase",
  CreateServerDockerCompose = "CreateServerDockerCompose",
  CreateServerDockerComposeDB = "CreateServerDockerComposeDB",
  CreatePrismaSchema = "CreatePrismaSchema",
  CreateServerPackageJson = "CreateServerPackageJson",
  CreateEntityModule = "CreateEntityModule",
  CreateEntityModuleBase = "CreateEntityModuleBase",
}

export interface AmplicationPlugin {
  init?: (name: string, version: string) => void;
  register: () => Events;
}
