import { EventName, Module } from "@amplication/code-gen-types";
import DsgContext from "./dsg-context";

export type PluginWrapper = (
  func: (...args: any) => any,
  event: EventName,
  ...args: any
) => any;

const pipe = (...fns: ((context: DsgContext, ...res: any) => any)[]) => (
  context: DsgContext,
  ...x: any
) => fns.reduce((res, fn) => {
  console.log("pipe", res, fn)
  return fn(context, ...res)
}, x);

class authPlugin {
  static srcDir = "";

  beforeCreateAuthModules(
    context: DsgContext,
    ...eventParams: any
  ) {
    const [srcDir] = eventParams
    // JwtAuthPlugin.srcDir = srcDir;
    console.log("****** beforeCreateAuthModules ******", typeof [srcDir, "jwt-auth-plugin/static/auth/"], srcDir)
    return [srcDir, "jwt-auth-plugin/static/auth/"]
  }

  async afterCreateAuthModules(
    context: DsgContext,
    eventParams: Module[]
  ) {
    console.log(authPlugin.srcDir)
    return [
      ...eventParams
    ];
  }
}

const jwtAuthPlugin = new authPlugin()



/**
 * this function can wrap all dsg function in order to assign before and after plugin logic
 * @param args => original DSG arguments
 * @param func => DSG function
 * @param event => event name to find the specific plugin
 */
const pluginWrapper: PluginWrapper = async (func, event, ...args): Promise<any> => {
  try {
    const context = DsgContext.getInstance;
    if (!context.plugins.hasOwnProperty(event)) return func(...args);

    const beforePlugins = context.plugins[event]?.before;
    const afterPlugins = context.plugins[event]?.after;

    const beforeFuncResults = beforePlugins
      ? pipe(jwtAuthPlugin.beforeCreateAuthModules)(context, ...args)
      : args;
    const funcResults = Object.prototype.toString.call(func) === "[object AsyncFunction]" ? await func(...beforeFuncResults) : func(...beforeFuncResults);
    const afterFuncResults = afterPlugins
    ? pipe(jwtAuthPlugin.afterCreateAuthModules)(context, funcResults)
      // ? pipe(...afterPlugins)(context, funcResults)
      : funcResults;

    return afterFuncResults;
  } catch (error) {
    console.log(error);
    return Error(JSON.stringify({ event, msg: error }));
  }
};

export default pluginWrapper;
