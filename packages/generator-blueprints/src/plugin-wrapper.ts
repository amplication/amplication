import { FileMap, blueprintTypes } from "@amplication/code-gen-types";
import util from "node:util";
import DsgContext from "./dsg-context";
import { IAstNode } from "@amplication/ast-types";

export type PluginWrapper = (
  func: (...args: any) => FileMap<IAstNode> | Promise<FileMap<IAstNode>>,
  event: blueprintTypes.BlueprintEventNames,
  ...args: any
) => any;

const beforeEventsPipe =
  (...fns: blueprintTypes.PluginBeforeEvent<blueprintTypes.EventParams>[]) =>
  (context: DsgContext, eventParams: blueprintTypes.EventParams) =>
    fns.reduce(
      async (res, fn) => fn(context, await res),
      Promise.resolve(eventParams)
    );

const afterEventsPipe =
  (
    ...fns: blueprintTypes.PluginAfterEvent<
      blueprintTypes.EventParams,
      IAstNode
    >[]
  ) =>
  (
    context: DsgContext,
    eventParams: blueprintTypes.EventParams,
    files: FileMap<IAstNode>
  ) =>
    fns.reduce(
      async (res, fn) => fn(context, eventParams, await res),
      Promise.resolve(files)
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
): Promise<FileMap<IAstNode>> => {
  if (context.utils.skipDefaultBehavior)
    return new FileMap<IAstNode>(DsgContext.getInstance.logger);

  return util.types.isAsyncFunction(func)
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
): Promise<FileMap<IAstNode>> => {
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

    const finalFiles = afterPlugins
      ? await afterEventsPipe(...afterPlugins)(
          context,
          args,
          defaultBehaviorModules
        )
      : defaultBehaviorModules;

    // Upsert all the final modules into the context.modules
    // ModuleMap.merge is not used because it would log a warning for each module
    for (const file of finalFiles.getAll()) {
      context.files.replace(file, file);
    }

    return finalFiles;
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
