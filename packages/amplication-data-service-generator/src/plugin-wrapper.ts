import { EventName } from "@amplication/code-gen-types";
import DsgContext from "./dsg-context";

export type PluginWrapper = (
  args: any[],
  func: (...args: any) => any,
  event: EventName
) => any;

const pipe = (...fns: (<T>(context: DsgContext, res: any) => T)[]) => (
  context: DsgContext,
  x: any
) => fns.reduce((res, fn) => fn(context, res), x);

/**
 * this function can wrap all dsg function in order to assign before and after plugin logic
 * @param args => original DSG arguments
 * @param func => DSG function
 * @param event => event name to find the specific plugin
 */
const pluginWrapper: PluginWrapper = async (args, func, event): Promise<any> => {
  try {
    const context = DsgContext.getInstance;
    if (!context.plugins.hasOwnProperty(event)) return func(...args);

    const beforePlugins = context.plugins[event]?.before;
    const afterPlugins = context.plugins[event]?.after;

    const beforeFuncResults = beforePlugins
      ? pipe(...beforePlugins)(context, args)
      : args;
    const funcResults = Object.prototype.toString.call(func) === "[object AsyncFunction]" ? await func(...beforeFuncResults) : func(...beforeFuncResults);
    const afterFuncResults = afterPlugins
      ? pipe(...afterPlugins)(context, funcResults)
      : funcResults;

    return afterFuncResults;
  } catch (error) {
    console.log(error);
    return Error(JSON.stringify({ event, msg: error }));
  }
};

export default pluginWrapper;
