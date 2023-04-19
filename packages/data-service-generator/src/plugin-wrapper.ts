import {
  EventNames,
  Module,
  EventParams,
  PluginAfterEvent,
  PluginBeforeEvent,
} from "@amplication/code-gen-types";
import DsgContext from "./dsg-context";

export type PluginWrapper = (
  func: (...args: any) => Module[] | Promise<Module[]>,
  event: EventNames,
  ...args: any
) => any;

const beforeEventsPipe =
  (...fns: PluginBeforeEvent<EventParams>[]) =>
  (context: DsgContext, eventParams: EventParams) =>
    fns.reduce(
      async (res, fn) => fn(context, await res),
      Promise.resolve(eventParams)
    );

const afterEventsPipe =
  (...fns: PluginAfterEvent<EventParams>[]) =>
  (context: DsgContext, eventParams: EventParams, modules: Module[]) =>
    fns.reduce(
      async (res, fn) => fn(context, eventParams, await res),
      Promise.resolve(modules)
    );

/**
 * DSG default behavior
 * @param context
 * @param func
 * @param beforeFuncResults
 * @returns
 */
const defaultBehavior = async (
  context: DsgContext,
  func: (...args: any) => any,
  beforeFuncResults: any
): Promise<Module[]> => {
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
): Promise<Module[]> => {
  const context = DsgContext.getInstance;

  try {
    context.utils.skipDefaultBehavior = false;
    context.utils.abort = false;

    if (!context.plugins.hasOwnProperty(event)) {
      return await func(args);
    }
    const beforePlugins = context.plugins[event]?.before || [];
    const afterPlugins = context.plugins[event]?.after || [];

    const updatedEventParams = beforePlugins
      ? await beforeEventsPipe(...beforePlugins)(context, args)
      : args;
    const defaultBehaviorModules = await defaultBehavior(
      context,
      func,
      updatedEventParams
    );

    const finalModules = afterPlugins
      ? await afterEventsPipe(...afterPlugins)(
          context,
          args,
          defaultBehaviorModules
        )
      : defaultBehaviorModules;

    context.modules.push(finalModules);
    return finalModules;
  } catch (error) {
    const friendlyErrorMessage = `Failed to execute plugin event ${event}. ${error.message}`;

    await context.logger.error(
      friendlyErrorMessage,
      { event },
      friendlyErrorMessage,
      error
    );

    if (context.utils.abort) {
      await context.logger.error(context.utils.abortMessage);
      throw Error();
    }

    throw error;
  }
};

export default pluginWrapper;
