import { EventsName } from "@amplication/code-gen-types";
import DsgContext from "./dsg-context";

export type PluginWrapper = (
  args: any[],
  func: (...args: any) => any,
  event: EventsName
) => any;

const pipe = (...fns: (<T>(context: DsgContext, res: any) => T)[]) => (
  context: DsgContext,
  x: any
) => fns.reduce((res, fn) => fn(context, res), x);

const pluginWrapper: PluginWrapper = (args, func, event) => {
  try {
    const context = DsgContext.getInstance;
    if (!context.plugins.hasOwnProperty(event)) return func(args);

    const beforePlugins = context.plugins[event]?.before;
    const afterPlugins = context.plugins[event]?.after;

    const beforeFuncResults = beforePlugins
      ? pipe(...beforePlugins)(context, args)
      : args;
    const funcResults = func(beforeFuncResults);
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
