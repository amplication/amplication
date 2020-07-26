import { namedTypes, builders } from "ast-types";
import { Module, relativeImportPath, readFile } from "../util/module";
import {
  interpolateAST,
  removeTSIgnoreComments,
  getImportDeclarations,
  getLastStatementFromFile,
} from "../util/ast";
import { print } from "recast";

const moduleTemplatePath = require.resolve("./templates/module.ts");

export async function createResourceModule(
  modulePath: string,
  entityType: string,
  entityServiceModule: string,
  entityControllerModule: string
): Promise<Module> {
  const file = await readFile(moduleTemplatePath);
  const controllerId = builders.identifier(`${entityType}Controller`);
  const serviceId = builders.identifier(`${entityType}Service`);

  interpolateAST(file, {
    ENTITY: builders.identifier(entityType),
    SERVICE: serviceId,
    CONTROLLER: controllerId,
    MODULE: builders.identifier(`${entityType}Module`),
  });

  const serviceImport = builders.importDeclaration(
    [builders.importSpecifier(serviceId)],
    builders.stringLiteral(relativeImportPath(modulePath, entityServiceModule))
  );

  const controllerImport = builders.importDeclaration(
    [builders.importSpecifier(controllerId)],
    builders.stringLiteral(
      relativeImportPath(modulePath, entityControllerModule)
    )
  );

  const imports = getImportDeclarations(file);
  const allImports = [...imports, serviceImport, controllerImport];
  const moduleClass = getLastStatementFromFile(
    file
  ) as namedTypes.ExportNamedDeclaration;

  const nextAst = builders.program([...allImports, moduleClass]);

  removeTSIgnoreComments(nextAst);

  return {
    path: modulePath,
    code: print(nextAst).code,
  };
}
