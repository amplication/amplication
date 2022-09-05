import { EventNames, Module, EventParams } from "@amplication/code-gen-types";
import DsgContext from "./dsg-context";

export type PluginWrapper = (
  func: (...args: any) => any,
  event: EventNames,
  ...args: any
) => any;

const pipe = (
  ...fns: ((context: DsgContext, res: EventParams | Module[]) => any)[]
) => (context: DsgContext, x: any) =>
  fns.reduce((res, fn) => {
    return fn(context, res);
  }, x);

const defaultBehavior = async (
  context: DsgContext,
  func: (...args: any) => any,
  beforeFuncResults: any
) => {
  if (context.utils.skipDefaultBehavior) return [];

  return Object.prototype.toString.call(func) === "[object AsyncFunction]"
    ? await func(beforeFuncResults)
    : func(beforeFuncResults);
};

/**
 * This function can wrap all dsg function in order to assign before and after plugin logic
 * @param args => original DSG arguments
 * @param func => DSG function
 * @param event => event name to find the specific plugin
 */
const pluginWrapper: PluginWrapper = async (
  func,
  event,
  args
): Promise<any> => {
  try {
    const context = DsgContext.getInstance;
    context.utils.skipDefaultBehavior = false;
    if (!context.plugins.hasOwnProperty(event)) return func(args);

    const beforePlugins = context.plugins[event]?.before || [];
    const afterPlugins = context.plugins[event]?.after || [];

    const updatedEventParams = beforePlugins
      ? pipe(...beforePlugins)(context, args)
      : args;
    const defaultBehaviorModules = await defaultBehavior(
      context,
      func,
      updatedEventParams
    );

    const finalModules = afterPlugins
      ? await pipe(...afterPlugins)(context, defaultBehaviorModules)
      : defaultBehaviorModules;

    context.modules.push(finalModules);
    return finalModules;
  } catch (error) {
    console.log(error);
    return Error(JSON.stringify({ event, msg: error }));
  }
};

export default pluginWrapper;
