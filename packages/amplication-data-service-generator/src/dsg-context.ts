import * as types from "@amplication/code-gen-types";
import {
  clientDirectories,
  ContextUtil,
  serverDirectories,
} from "@amplication/code-gen-types";
import { EnumResourceType } from "./models";
import winston from "winston";
import { readPluginStaticModules } from "./read-static-modules";

const contextUtil = {
  skipDefaultBehavior: false,
  importStaticModules: readPluginStaticModules,
};

class DsgContext implements types.DsgContext {
  public appInfo!: types.AppInfo;
  public entities: types.Entity[] = [];
  public roles: types.Role[] = [];
  public modules: types.Module[] = [];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public DTOs: types.DTOs = {};
  public plugins: types.PluginMap = {};
  public logger: winston.Logger = winston.createLogger();
  public utils: ContextUtil = contextUtil;
  public serviceTopics: types.ServiceTopics[] = [];
  public topics: types.Topic[] = [];

  public clientDirectories!: clientDirectories;
  public serverDirectories!: serverDirectories;

  private static instance: DsgContext;

  public static get getInstance(): DsgContext {
    return this.instance || (this.instance = new this());
  }

  private constructor() {
    //prevent external code from creating instances of the context
  }
  public resourceType!: EnumResourceType;
  public readonly resourceInfo = this.appInfo;
  public pluginInstallations: types.PluginInstallation[] = [];
  public otherResources?: types.DSGResourceData[] | undefined;
}

export default DsgContext;
