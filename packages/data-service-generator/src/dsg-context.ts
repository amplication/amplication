import * as types from "@amplication/code-gen-types";
import {
  BuildLogger as IBuildLogger,
  clientDirectories,
  ContextUtil,
  serverDirectories,
} from "@amplication/code-gen-types";
import { EnumResourceType } from "./models";
import { readPluginStaticModules } from "./utils/read-static-modules";
import {
  USER_ENTITY_NAME,
  USER_NAME_FIELD_NAME,
  USER_PASSWORD_FIELD_NAME,
  USER_ROLES_FIELD_NAME,
} from "./server/user-entity/user-entity";
import { BuildLogger } from "./build-logger";

class DsgContext implements types.DsgContext {
  public appInfo!: types.AppInfo;
  public entities: types.Entity[] = [];
  public buildId: string;
  public roles: types.Role[] = [];
  public modules: types.ModuleMap;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public DTOs: types.DTOs = {};
  public plugins: types.PluginMap = {};
  public readonly logger: IBuildLogger;
  public utils: ContextUtil = {
    skipDefaultBehavior: false,
    abortGeneration: (msg: string) => {
      this.utils.abortMessage = msg;
      this.utils.abort = true;
    },
    abort: false,
    abortMessage: "",
    importStaticModules: readPluginStaticModules,
  };
  public serviceTopics: types.ServiceTopics[] = [];
  public topics: types.Topic[] = [];

  public clientDirectories!: clientDirectories;
  public serverDirectories!: serverDirectories;

  public hasDecimalFields = false;
  public hasBigIntFields = false;

  public userEntityName: string = USER_ENTITY_NAME;
  public userNameFieldName: string = USER_NAME_FIELD_NAME;
  public userPasswordFieldName: string = USER_PASSWORD_FIELD_NAME;
  public userRolesFieldName: string = USER_ROLES_FIELD_NAME;

  private static instance: DsgContext;

  public static get getInstance(): DsgContext {
    return this.instance || (this.instance = new this());
  }

  private constructor() {
    //prevent external code from creating instances of the context
    this.logger = new BuildLogger();
    this.modules = new types.ModuleMap(this.logger);
  }

  public get resourceInfo(): types.AppInfo {
    return this.appInfo;
  }

  public resourceType!: EnumResourceType;
  public pluginInstallations: types.PluginInstallation[] = [];
  public otherResources?: types.DSGResourceData[] | undefined;
}

export default DsgContext;
