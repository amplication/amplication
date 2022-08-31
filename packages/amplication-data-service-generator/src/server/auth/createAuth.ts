import { EventNames, Module } from "@amplication/code-gen-types";
import pluginWrapper from "../../plugin-wrapper";
import DsgContext from "../../dsg-context";
import { createDefaultGuard } from "./guards/createDefaultGuard";
import { createTokenServiceTests } from "./token/createTokenSerivceTests";
import { createTokenService } from "./token/createTokenService";

export const createAuthModules = (eventParams: { srcDir: string }): Module[] =>
  pluginWrapper(
    async (eventParams: { srcDir: string }): Promise<Module[]> => {
      const context = DsgContext.getInstance;
      const authDir = `${eventParams.srcDir}/auth`;
      const authTestsDir = `${eventParams.srcDir}/tests/auth`;

      const {
        settings: { authProvider },
      } = context.appInfo;
      const defaultGuardFile = await createDefaultGuard(authProvider, authDir);

      return Promise.all([
        defaultGuardFile,
        createTokenService(authDir, authProvider),
        createTokenServiceTests(authTestsDir, authProvider),
      ]);
    },
    EventNames.CreateAuthModules,
    eventParams
  );
