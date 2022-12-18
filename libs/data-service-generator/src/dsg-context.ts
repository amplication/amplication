import * as types from "@amplication/code-gen-types";
import {
  clientDirectories,
  ContextUtil,
  serverDirectories,
} from "@amplication/code-gen-types";
import { EnumResourceType } from "./models";
import winston from "winston";
import { readPluginStaticModules } from "./util/read-static-modules";

// const contextUtil = {
//   skipDefaultBehavior: false,
//   abortGeneration: (msg: string) => {
//     DsgContext.utils.abortMessage = msg;
//     DsgContext.utils.abort = true;
//   },
//   abort: false,
//   abortMessage: "",
//   importStaticModules: readPluginStaticModules,
// };

class DsgContext implements types.DsgContext {
  public appInfo!: types.AppInfo;
  public entities: types.Entity[] = [];
  public roles: types.Role[] = [];
  public modules: types.Module[] = [];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public DTOs: types.DTOs = {};
  public plugins: types.PluginMap = {};
  public logger: winston.Logger = winston.createLogger();
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

  private static instance: DsgContext;

  public static get getInstance(): DsgContext {
    return this.instance || (this.instance = new this());
  }

  private constructor() {
    //prevent external code from creating instances of the context
  }

  public get resourceInfo(): types.AppInfo {
    return this.appInfo;
  }

  public resourceType!: EnumResourceType;
  public pluginInstallations: types.PluginInstallation[] = [];
  public otherResources?: types.DSGResourceData[] | undefined;
}

export default DsgContext;
