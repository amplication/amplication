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
import { authPath } from "../createAuth";

type AuthGuardMetaData = {
  path: string;
  fileName: string;
};

export async function createDefaultGuard(
  authProvider: EnumAuthProviderType
): Promise<Module> {
  const defaultAuthGuardPath = require.resolve(
    "./guards/defaultAuth.guard.template.ts"
  );
  const modulePath = `${authPath}/defaultAuth.guard.ts`;

  const guardFile = await readFile(defaultAuthGuardPath);
  const { fileName, path } = getMetaDataForAuthGuard(authProvider);
  const baseGuardIdentifier = builders.identifier(fileName);
  interpolate(guardFile, {
    GUARD: baseGuardIdentifier,
  });
  const baseGuardImport = importNames(
    [baseGuardIdentifier],
    relativeImportPath(modulePath, path)
  );
  addImports(guardFile, [baseGuardImport]);
  removeTSClassDeclares(guardFile);
  return { path: modulePath, code: print(guardFile).code };
}
function getMetaDataForAuthGuard(
  setAuthGuard: EnumAuthProviderType
): AuthGuardMetaData {
  const data: AuthGuardMetaData = { fileName: "", path: "" };
  switch (setAuthGuard) {
    case EnumAuthProviderType.Http:
      data.fileName = "BasicAuthGuard";
      data.path = `${authPath}/${data.fileName}.ts`;
      break;
    case EnumAuthProviderType.Jwt:
      data.fileName = "JwtAuthGuard";
      data.path = `${authPath}/jwt/${data.fileName}.ts`;
      break;
    default:
      break;
  }
  return data;
}
