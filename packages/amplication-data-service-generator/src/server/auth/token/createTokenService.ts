import { print } from "recast";
import { EnumAuthProviderType } from "../../../models";
import { Module } from "../../../types";
import { removeTSIgnoreComments } from "../../../util/ast";
import { readFile } from "../../../util/module";

export async function createTokenService(
  authDir: string,
  authProvider: EnumAuthProviderType
): Promise<Module> {
  const templatePath = require.resolve(
    `./${authProvider.toLowerCase()}Token.service.template.ts`
  );
  const file = await readFile(templatePath);
  const filePath = `${authDir}/base/token.service.base.ts`;

  removeTSIgnoreComments(file);

  return { code: print(file).code, path: filePath };
}
