import { print } from "recast";
import { EnumAuthProviderType } from "../../../models";
import { Module } from "../../../types";
import { readFile } from "../../../util/module";

export async function createTokenServiceTests(
  authTestsDir: string,
  authProvider: EnumAuthProviderType
): Promise<Module> {
  const templatePath = require.resolve(
    `./${authProvider.toLowerCase()}Token.service.spec.template.ts`
  );
  const file = await readFile(templatePath);
  const filePath = `${authTestsDir}/token.service.spec.ts`;

  return { code: print(file).code, path: filePath };
}
