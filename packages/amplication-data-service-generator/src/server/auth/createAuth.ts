import { EventsName, Module } from "@amplication/code-gen-types";
import pluginWrapper from "../../plugin-wrapper";
import DsgContext from "../../dsg-context";
import { createDefaultGuard } from "./guards/createDefaultGuard";
import { createTokenServiceTests } from "./token/createTokenSerivceTests";
import { createTokenService } from "./token/createTokenService";

async function innerCreateAuthModules(
  srcDir: string,
  templatePath = ""
): Promise<Module[]> {
  const context = DsgContext.getInstance;
  const authDir = `${srcDir}/auth`;
  const authTestsDir = `${srcDir}/tests/auth`;
  console.log("*** innerCreateAuthModules ****", srcDir, templatePath)
  const {
    settings: { authProvider },
  } = context.appInfo;
  const defaultGuardFile = await createDefaultGuard(authProvider, authDir);
  const tokenFile = createTokenService(
    authDir,
    `${
      templatePath || "./"
    }${authProvider.toLocaleLowerCase()}Token.service.template.ts`
  );
  const tokenTestFile = createTokenServiceTests(
    authTestsDir,
    `${
      templatePath || "./"
    }${authProvider.toLocaleLowerCase()}Token.service.spec.template.ts`
  );
  return Promise.all([defaultGuardFile, tokenFile, tokenTestFile]);
}

export const createAuthModules = (srcDir: string, templatePath = ""): Module[] =>
  pluginWrapper(
    innerCreateAuthModules,
    EventsName.CreateAuthModules,
    srcDir,
    templatePath,
  );
