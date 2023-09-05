import {
  CreateServerAuthParams,
  EventNames,
  ModuleMap,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../plugin-wrapper";
import DsgContext from "../../dsg-context";

/**
 *
 * @returns Promise<ModuleMap - by default returns an empty Map, but plugins can override this function
 * to return a map of modules (files) that related to the auth logic and will be written to the server auth folder
 */
export function createAuthModules(
  eventParams: CreateServerAuthParams = {}
): Promise<ModuleMap> {
  return pluginWrapper(
    () => new ModuleMap(DsgContext.getInstance.logger),
    EventNames.CreateServerAuth,
    eventParams
  );
}
