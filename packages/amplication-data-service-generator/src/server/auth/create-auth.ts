import { EventNames, Module } from "@amplication/code-gen-types";
import pluginWrapper from "../../plugin-wrapper";

export function createAuthModules(): Module[] {
  return pluginWrapper(
    createAuthModulesInternal,
    EventNames.CreateServerAuth,
    {}
  );
}

/**
 *
 * @returns Promise<Module[] - by default returns an array with one empty module [{ path: "", code: "" }],
 * but plugins can override this function to return an array of modules (files) that related to the auth logic and
 *  will be written to the server auth folder
 */
async function createAuthModulesInternal(): Promise<Module[]> {
  return [{ path: "", code: "" }];
}
