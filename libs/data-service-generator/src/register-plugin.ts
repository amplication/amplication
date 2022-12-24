import {
  EventNames,
  Events,
  PluginInstallation,
  PluginMap,
} from "@amplication/code-gen-types";
import type { Promisable } from "type-fest";

class EmptyClass {}

const functionsObject = ["[object Function]", "[object AsyncFunction]"];

export type AlternativeImportFunction = (
  name: string
) => Promisable<string | null>;

/**
 * generator function that import the plugin requested by user
 * @param pluginList
 * @returns Plugin class
 */
async function* getPluginFuncGenerator(
  pluginList: PluginInstallation[],
  alternativeImport?: AlternativeImportFunction
): AsyncGenerator<new () => any> {
  try {
    const pluginListLength = pluginList.length;
    let index = 0;

    do {
      const packageName = pluginList[index].npm;

      const func = await getPlugin(packageName, alternativeImport);

      ++index;
      if (!func.hasOwnProperty("default")) yield EmptyClass;

      yield func.default;
    } while (pluginListLength > index);
  } catch (error) {
    console.log(error); /// log error
    return EmptyClass;
  }
}

async function getPlugin(
  packageName: string,
  customPath: AlternativeImportFunction | undefined
): Promise<any> {
  if (!customPath) {
    return await import(packageName);
  }
  const path = await customPath(packageName);
  if (path) {
    return await import(path);
  }
}

/**
 * loop through all plugin list and set the plugin under each event
 */
const getAllPlugins = async (
  pluginList: PluginInstallation[],
  alternativeImport?: AlternativeImportFunction
): Promise<Events[]> => {
  if (!pluginList.length) return [];

  const pluginFuncsArr: Events[] = [];

  for await (const pluginFunc of getPluginFuncGenerator(
    pluginList,
    alternativeImport
  )) {
    const initializeClass = new pluginFunc();
    if (!initializeClass.register) continue;

    const pluginEvents = initializeClass.register();
    if (Object.prototype.toString.call(pluginEvents) !== "[object Object]")
      continue;

    pluginFuncsArr.push(pluginEvents);
  }

  return pluginFuncsArr;
};

/**
 * main plugin manger function. it trigger plugin import and set the structure for plugin context
 */
const registerPlugins = async (
  pluginList: PluginInstallation[],
  alternativeImport?: AlternativeImportFunction
): Promise<{ [K in EventNames]?: any }> => {
  const pluginMap: PluginMap = {};

  const pluginFuncsArr = (await getAllPlugins(
    pluginList,
    alternativeImport
  )) as Events[];
  if (!pluginFuncsArr.length) return {};

  pluginFuncsArr.reduce(
    (pluginContext: { [key: string]: any }, plugin: Events) => {
      Object.keys(plugin).forEach((eventKey: string) => {
        if (!pluginMap.hasOwnProperty(eventKey))
          pluginContext[eventKey as EventNames] = { before: [], after: [] };

        const { before, after } = plugin[eventKey as keyof Events] || {};

        functionsObject.includes(Object.prototype.toString.call(before)) &&
          pluginContext[eventKey].before.push(before);
        functionsObject.includes(Object.prototype.toString.call(after)) &&
          pluginContext[eventKey].after.push(after);
      });
      return pluginContext;
    },
    pluginMap
  );

  return pluginMap;
};

export default registerPlugins;
