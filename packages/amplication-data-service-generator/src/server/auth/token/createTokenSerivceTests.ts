import { print } from "recast";
import { EnumAuthProviderType } from "../../../models";
import { Module } from "../../../types";
import { removeTSIgnoreComments } from "../../../util/ast";
import { readFile } from "../../../util/module";

export async function createTokenServiceTests(
  authTestsDir: string,
  authProvider: EnumAuthProviderType
): Promise<Module> {
  const name =
    authProvider === EnumAuthProviderType.Http ? "Basic" : authProvider;
  const templatePath = require.resolve(
    `./${name.toLowerCase()}Token.service.spec.template.ts`
  );
  const file = await readFile(templatePath);
  const filePath = `${authTestsDir}/token.service.spec.ts`;

  removeTSIgnoreComments(file);

  return { code: print(file).code, path: filePath };
}
