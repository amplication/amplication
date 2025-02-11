import * as types from "@amplication/code-gen-types";
import {
  BuildLogger as IBuildLogger,
  clientDirectories,
  serverDirectories,
  ModuleActionsAndDtosMap,
  FileMap,
} from "@amplication/code-gen-types";

import { EnumResourceType } from "./models";
import {
  importStaticFilesWithReplacements,
  readPluginStaticFiles,
  replacePlaceholders,
  replaceText,
} from "./utils/read-static-files";

import { BuildLogger } from "@amplication/dsg-utils";
import { AstNode } from "@amplication/csharp-ast";

class DsgContext implements types.blueprintTypes.DsgContext {
  public appInfo!: types.AppInfo;
  public entities: types.Entity[] = [];
  public buildId: string;
  public roles: types.Role[] = [];
  public files: FileMap<AstNode>;
  public generateGrpc: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public DTOs: types.DTOs = {};
  public plugins: types.blueprintTypes.PluginMap = {};
  public entityActionsMap: types.EntityActionsMap = {};
  public moduleActionsAndDtoMap: ModuleActionsAndDtosMap;

  public readonly logger: IBuildLogger;
  public utils: types.blueprintTypes.ContextUtil = {
    skipDefaultBehavior: false,
    abortGeneration: (msg: string) => {
      this.utils.abortMessage = msg;
      this.utils.abort = true;
    },
    abort: false,
    abortMessage: "",
    importStaticFiles: readPluginStaticFiles,
    importStaticFilesWithReplacements: importStaticFilesWithReplacements,
    replacePlaceholders: replacePlaceholders,
    replaceText: replaceText,
  };
  public serviceTopics: types.ServiceTopics[] = [];
  public topics: types.Topic[] = [];

  public clientDirectories!: clientDirectories;
  public serverDirectories!: serverDirectories;

  public hasDecimalFields = false;
  public hasBigIntFields = false;

  public userEntityName = "";
  public userNameFieldName = "";
  public userPasswordFieldName = "";
  public userRolesFieldName = "";

  private static instance: DsgContext;

  public static get getInstance(): DsgContext {
    return this.instance || (this.instance = new this());
  }

  private constructor() {
    //prevent external code from creating instances of the context
    this.logger = new BuildLogger();
    this.files = new FileMap<AstNode>(this.logger);
  }

  public get resourceInfo(): types.AppInfo {
    return this.appInfo;
  }

  public resourceType!: EnumResourceType;
  public pluginInstallations: types.PluginInstallation[] = [];
  public moduleActions: types.ModuleAction[] = [];
  public moduleContainers: types.ModuleContainer[] = [];
  public moduleDtos: types.ModuleDto[] = [];
  public resourceSettings?: types.ResourceSettings;
  public relations: types.Relation[] = [];

  public otherResources?: types.DSGResourceData[] | undefined;
}

export default DsgContext;
