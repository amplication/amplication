import { AstNode, CodeBlock } from "@amplication/csharp-ast";
import type { Promisable } from "type-fest";
import { BuildLogger } from "../build-logger";
import {
  clientDirectories,
  DTOs,
  EntityActionsMap,
  ModuleActionsAndDtosMap,
  serverDirectories,
} from "../code-gen-types";
import { DSGResourceData } from "../dsg-resource-data";
import { FileMap } from "../files";
import { BlueprintEvents } from "./blueprint-plugin-events.types";

export interface EventParams {}

export type PluginBeforeEvent<T extends EventParams> = (
  dsgContext: DsgContext,
  eventParams: T
) => Promisable<T>;

export type PluginAfterEvent<T extends EventParams, F extends AstNode> = (
  dsgContext: DsgContext,
  eventParams: T,
  files: FileMap<F>
) => Promisable<FileMap<F>>;

export interface PluginEventType<
  T extends EventParams,
  F extends AstNode = CodeBlock
> {
  before?: PluginBeforeEvent<T>;
  after?: PluginAfterEvent<T, F>;
}

export interface PrintResultType {
  code: string;
  map?: any;
  toString(): string;
}

export interface ContextUtil {
  skipDefaultBehavior: boolean;
  abortGeneration: (msg: string) => void;
  abortMessage?: string;
  abort: boolean;
  importStaticFiles: (
    source: string,
    basePath: string
  ) => Promise<FileMap<string>>;
}

export interface DsgContext extends DSGResourceData {
  /**
   * List of generated files.
   */
  files: FileMap<AstNode>;
  DTOs: DTOs;
  plugins: PluginMap;
  /**
   * Logger for user facing logs. Logs will be visible in the build log.
   */
  logger: BuildLogger;
  utils: ContextUtil;
  clientDirectories: clientDirectories;
  serverDirectories: serverDirectories;
  userEntityName: string;
  userNameFieldName: string;
  userPasswordFieldName: string;
  userRolesFieldName: string;
  entityActionsMap: EntityActionsMap;
  moduleActionsAndDtoMap: ModuleActionsAndDtosMap;
}

export type PluginWrapper = (args: EventParams, func: () => void) => any;

export type PluginMap = {
  [K in BlueprintEventNames]?: {
    before?: PluginBeforeEvent<EventParams>[];
    after?: PluginAfterEvent<EventParams, AstNode>[];
  };
};

export enum BlueprintEventNames {
  createBlueprint = "createBlueprint",
}

export interface AmplicationPlugin {
  init?: (name: string, version: string) => void;
  register: () => BlueprintEvents;
}
