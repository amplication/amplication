import { namedTypes, builders } from "ast-types";
import { Module, relativeImportPath, readCode } from "../util/module";
import {
  parse,
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
  const template = await readCode(moduleTemplatePath);
  const ast = parse(template) as namedTypes.File;
  const controllerId = builders.identifier(`${entityType}Controller`);
  const serviceId = builders.identifier(`${entityType}Service`);

  interpolateAST(ast, {
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

  const imports = getImportDeclarations(ast);
  const allImports = [...imports, serviceImport, controllerImport];
  const moduleClass = getLastStatementFromFile(
    ast
  ) as namedTypes.ExportNamedDeclaration;

  const nextAst = builders.program([...allImports, moduleClass]);

  removeTSIgnoreComments(nextAst);

  return {
    path: modulePath,
    code: print(nextAst).code,
  };
}
