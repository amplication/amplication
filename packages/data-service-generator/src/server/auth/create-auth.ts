import {
  CreateServerAuthParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../plugin-wrapper";

/**
 *
 * @returns Promise<Module[] - by default returns an empty array, but plugins can override this function
 * to return an array of modules (files) that related to the auth logic and will be written to the server auth folder
 */
export function createAuthModules(
  eventParams: CreateServerAuthParams = {}
): Promise<Module[]> {
  return pluginWrapper(() => [], EventNames.CreateServerAuth, eventParams);
}
