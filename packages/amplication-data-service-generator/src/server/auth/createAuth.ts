import {
  CreateAuthModulesParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../plugin-wrapper";
import DsgContext from "../../dsg-context";
import { createDefaultGuard } from "./guards/createDefaultGuard";
import { createTokenServiceTests } from "./token/createTokenSerivceTests";
import { createTokenService } from "./token/createTokenService";

export function createAuthModules(
  eventParams: CreateAuthModulesParams["before"]
): Promise<Module[]> {
  return pluginWrapper(
    createAuthModulesInternal,
    EventNames.CreateAuthModules,
    eventParams
  );
}

async function createAuthModulesInternal({
  srcDir,
}: CreateAuthModulesParams["before"]): Promise<Module[]> {
  const context = DsgContext.getInstance;
  const authDir = `${srcDir}/auth`;
  const authTestsDir = `${srcDir}/tests/auth`;

  const {
    settings: { authProvider },
  } = context.appInfo;
  const defaultGuardFile = await createDefaultGuard(authProvider, authDir);

  return Promise.all([
    defaultGuardFile,
    createTokenService(authDir, authProvider),
    createTokenServiceTests(authTestsDir, authProvider),
  ]);
}
