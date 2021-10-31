import { print } from "recast";
import { EnumAuthProviderType } from "../../../models";
import { Module } from "../../../types";
import { removeTSIgnoreComments } from "../../../util/ast";
import { readFile } from "../../../util/module";

export async function createTokenService(
  authDir: string,
  authProvider: EnumAuthProviderType
): Promise<Module> {
  const name =
    authProvider === EnumAuthProviderType.Http ? "Basic" : authProvider;
  const file = await readFile(
    require.resolve(`./templates/${name.toLowerCase()}Token.service.ts`)
  );
  const filePath = `${authDir}/base/token.service.base.ts`;

  removeTSIgnoreComments(file);

  return { code: print(file).code, path: filePath };
}
