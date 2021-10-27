import { builders } from "ast-types";
import { print } from "recast";
import { EnumAuthProviderType } from "../../../models";
import { Module } from "../../../types";
import {
  addImports,
  importNames,
  interpolate,
  removeTSClassDeclares,
} from "../../../util/ast";
import { readFile, relativeImportPath } from "../../../util/module";

export async function createTokenService(
  authDir: string,
  authProvider: EnumAuthProviderType
): Promise<Module> {
  const name =
    authProvider === EnumAuthProviderType.Http ? "Basic" : authProvider;
  const file = await readFile(require.resolve("./token.service.template.ts"));
  const filePath = `${authDir}/token.service.ts`;
  const importPath = `${authDir}/${name}/${name.toLowerCase()}Token.service.ts`;
  const selectedTokenService = builders.identifier(`${name}TokenService`);
  interpolate(file, { SELECTED_TOKEN_SERVICE: selectedTokenService });
  const selectedService = importNames(
    [selectedTokenService],
    relativeImportPath(filePath, importPath)
  );
  addImports(file, [selectedService]);

  removeTSClassDeclares(file);

  return { code: print(file).code, path: filePath };
}
