import {
  DsgPlugin,
  Events,
  EventsName,
  PluginMap,
} from "@amplication/code-gen-types";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFunction = () => {};

/**
 * generator function that import the plugin requested by user
 * @param pluginList
 * @returns Plugin class
 */
async function* getPluginFuncGenerator(pluginList: DsgPlugin[]) {
  try {
    const pluginListLength = pluginList.length;
    let index = 0;

    do {
      const packageName = pluginList[index].packageName;
      const func = await import(packageName);

      ++index;
      if (!func.hasOwnProperty("default")) yield emptyFunction;

      yield func.default;
    } while (pluginListLength > index);
  } catch (error) {
    console.log(error); /// log error
    return emptyFunction;
  }
}

/**
 * loop through all plugin list and set the plugin under each event
 * @param pluginList
 * @returns Array: Events[]
 */
const getAllPlugins = async (pluginList: DsgPlugin[]) => {
  if (!pluginList.length) return {};
  const pluginFuncsArr: Events[] = [];

  for await (const pluginFunc of getPluginFuncGenerator(pluginList)) {
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
 * @param pluginList
 * @returns Map: Events
 */
const pluginManager = async (
  pluginList: DsgPlugin[]
): Promise<{ [K in EventsName]?: any }> => {
  const pluginMap: PluginMap = {};

  const pluginFuncsArr = (await getAllPlugins(pluginList)) as Events[];
  if (!pluginFuncsArr.length) return {};

  pluginFuncsArr.reduce(
    (pluginContext: { [key: string]: any }, plugin: Events) => {
      Object.keys(plugin).forEach((eventKey: string) => {
        if (!pluginMap.hasOwnProperty(eventKey))
          pluginContext[eventKey as EventsName] = { before: [], after: [] };

        const { before, after } = plugin[eventKey as keyof Events] || {};
        Object.prototype.toString.call(before) === "[object Function]" &&
          pluginContext[eventKey].before.push(before);
        Object.prototype.toString.call(after) === "[object Function]" &&
          pluginContext[eventKey].after.push(after);
      });
      return pluginContext;
    },
    pluginMap
  );

  return pluginMap;
};

export default pluginManager;
