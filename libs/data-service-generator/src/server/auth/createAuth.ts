import {
  CreateServerAuthParams,
  EventNames,
  Module,
} from "@amplication/code-gen-types";
import pluginWrapper from "../../plugin-wrapper";
import DsgContext from "../../dsg-context";
import { createDefaultGuard } from "./guards/createDefaultGuard";
import { createTokenServiceTests } from "./token/createTokenSerivceTests";
import { createTokenService } from "./token/createTokenService";

export function createAuthModules(): Module[] {
  return pluginWrapper(
    createAuthModulesInternal,
    EventNames.CreateServerAuth,
    {}
  );
}

async function createAuthModulesInternal(
  eventParams: CreateServerAuthParams
): Promise<Module[]> {
  const { appInfo, serverDirectories } = DsgContext.getInstance;
  const authDir = `${serverDirectories.srcDirectory}/auth`;
  const authTestsDir = `${serverDirectories.srcDirectory}/tests/auth`;

  const {
    settings: { authProvider },
  } = appInfo;
  const defaultGuardFile = await createDefaultGuard(authProvider, authDir);

  return Promise.all([
    defaultGuardFile,
    createTokenService(authDir, authProvider),
    createTokenServiceTests(authTestsDir, authProvider),
  ]);
}
