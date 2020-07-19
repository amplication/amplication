import * as path from "path";
import * as recast from "recast";
import { builders, namedTypes } from "ast-types";

import {
  OpenAPIObject,
  PathObject,
  OperationObject,
  SchemaObject,
  ParameterObject,
} from "openapi3-ts";
import {
  Module,
  readCode,
  relativeImportPath,
  interpolateAST,
  docComment,
  getMethodFromTemplateAST,
  parse,
  getLastStatementFromFile,
  getImportDeclarations,
  consolidateImports,
} from "../util/module";
import {
  HTTPMethod,
  getExpressVersion,
  resolveRef,
  getContentSchemaRef,
  removeSchemaPrefix,
} from "../util/open-api";

const controllerTemplatePath = require.resolve(
  "./templates/controller/controller.ts"
);
const controllerFindOneTemplatePath = require.resolve(
  "./templates/controller/find-one.ts"
);
const controllerFindManyTemplatePath = require.resolve(
  "./templates/controller/find-many.ts"
);
const controllerCreateTemplatePath = require.resolve(
  "./templates/controller/create.ts"
);

export async function createControllerModule(
  api: OpenAPIObject,
  paths: PathObject,
  resource: string,
  entity: string,
  entityType: string,
  entityDTOModule: string,
  entityServiceModule: string
): Promise<Module> {
  const modulePath = path.join(entity, `${entity}.controller.ts`);
  const imports: namedTypes.ImportDeclaration[] = [];
  const methods: namedTypes.ClassMethod[] = [];
  for (const [path, pathSpec] of Object.entries(paths)) {
    for (const [httpMethod, operation] of Object.entries(pathSpec)) {
      const ast = await createControllerMethod(
        api,
        entityType,
        httpMethod as HTTPMethod,
        path,
        operation as OperationObject,
        modulePath
      );
      const moduleImports = getImportDeclarations(ast);
      const method = getMethodFromTemplateAST(ast);
      methods.push(method);
      imports.push(...moduleImports);
    }
  }

  /** @todo add import to dto module */

  const template = await readCode(controllerTemplatePath);
  const ast = parse(template) as namedTypes.File;

  const serviceId = builders.identifier(`${entityType}Service`);

  interpolateAST(ast, {
    RESOURCE: builders.stringLiteral(resource),
    CONTROLLER: builders.identifier(`${entityType}Controller`),
    SERVICE: serviceId,
  });

  const moduleImports = getImportDeclarations(ast);
  const serviceImport = builders.importDeclaration(
    [builders.importSpecifier(serviceId)],
    builders.stringLiteral(relativeImportPath(modulePath, entityServiceModule))
  );
  const dtoImport = builders.importDeclaration(
    [builders.importSpecifier(builders.identifier(entityType))],
    builders.stringLiteral(relativeImportPath(modulePath, entityDTOModule))
  );

  const allImports = [
    ...moduleImports,
    ...imports,
    serviceImport,
    /** @todo move to methods */
    dtoImport,
  ];

  const consolidatedImports = consolidateImports(allImports);

  const exportNamedDeclaration = getLastStatementFromFile(
    ast
  ) as namedTypes.ExportNamedDeclaration;

  const classDeclaration = exportNamedDeclaration.declaration as namedTypes.ClassDeclaration;

  classDeclaration.body.body.push(...methods);

  const nextAst = builders.file(
    builders.program([...consolidatedImports, exportNamedDeclaration])
  );

  return {
    path: modulePath,
    code: recast.print(nextAst).code,
  };
}

async function createControllerMethod(
  api: OpenAPIObject,
  entityType: string,
  method: HTTPMethod,
  route: string,
  operation: OperationObject,
  modulePath: string
): Promise<namedTypes.File> {
  /** @todo handle deep paths */
  const [, , parameter] = getExpressVersion(route).split("/");
  switch (method) {
    case HTTPMethod.get: {
      /** @todo use path */
      const response = operation.responses["200"];
      const ref = getContentSchemaRef(response.content);
      const schema = resolveRef(api, ref) as SchemaObject;
      switch (schema.type) {
        case "object": {
          return createFindOne(operation, entityType, parameter);
        }
        case "array": {
          return createFindMany(operation, entityType);
        }
      }
    }
    case HTTPMethod.post: {
      return createCreate(operation, entityType, modulePath);
    }
    default: {
      throw new Error(`Unknown method: ${method}`);
    }
  }
}

async function createFindOne(
  operation: OperationObject,
  entityType: string,
  parameter: string
) {
  if (!operation.summary) {
    throw new Error("operation.summary must be defined");
  }

  const template = await readCode(controllerFindOneTemplatePath);
  const ast = parse(template) as namedTypes.File;

  const imports = getImportDeclarations(ast);

  interpolateAST(ast, {
    ENTITY: builders.identifier(entityType),
    PATH: builders.stringLiteral(parameter),
    /** @todo use operation query parameters */
    QUERY: builders.tsTypeLiteral([]),
    PARAMS: createParamsType(operation),
  });

  const method = getMethodFromTemplateAST(ast);
  method.comments = [docComment(operation.summary)];

  return ast;
}

async function createFindMany(operation: OperationObject, entityType: string) {
  if (!operation.summary) {
    throw new Error("operation.summary must be defined");
  }
  const template = await readCode(controllerFindManyTemplatePath);
  const ast = parse(template) as namedTypes.File;

  interpolateAST(ast, {
    ENTITY: builders.identifier(entityType),
    /** @todo use operation query parameters */
    QUERY: builders.tsTypeLiteral([]),
  });

  const method = getMethodFromTemplateAST(ast);
  method.comments = [docComment(operation.summary)];

  return ast;
}

async function createCreate(
  operation: OperationObject,
  entityType: string,
  modulePath: string
) {
  if (!operation.summary) {
    throw new Error("operation.summary must be defined");
  }
  if (
    !(
      operation.requestBody &&
      "content" in operation.requestBody &&
      "application/json" in operation.requestBody.content &&
      operation.requestBody.content["application/json"].schema &&
      "$ref" in operation.requestBody.content["application/json"].schema
    )
  ) {
    throw new Error(
      "Operation must have requestBody.content['application/json'].schema['$ref'] defined"
    );
  }
  const bodyType = removeSchemaPrefix(
    operation.requestBody.content["application/json"].schema["$ref"]
  );
  const template = await readCode(controllerCreateTemplatePath);
  const ast = parse(template) as namedTypes.File;
  const dtoModule = path.join("dto", bodyType + ".ts");
  const dtoModuleImport = relativeImportPath(modulePath, dtoModule);

  interpolateAST(ast, {
    ENTITY: builders.identifier(entityType),
    BODY_TYPE: builders.identifier(bodyType),
    /** @todo use operation query parameters */
    QUERY: builders.tsTypeLiteral([]),
  });

  const method = getMethodFromTemplateAST(ast);
  method.comments = [docComment(operation.summary)];

  ast.program.body.unshift(
    builders.importDeclaration(
      [builders.importSpecifier(builders.identifier(bodyType))],
      builders.stringLiteral(dtoModuleImport)
    )
  );

  return ast;
}

/**
 * Build the params type for nest's controller Params decorated argument.
 * @param operation The OpenAPI Operation of the parameters to use
 * @returns The new TypeScript object type as AST node
 */
function createParamsType(
  operation: OperationObject
): namedTypes.TSTypeLiteral {
  if (!operation.parameters) {
    throw new Error("operation.parameters must be defined");
  }
  const pathParameters = operation.parameters.filter(
    (parameter): parameter is ParameterObject =>
      "in" in parameter && parameter.in === "path"
  );
  const paramsPropertySignatures = pathParameters.map((parameter) =>
    builders.tsPropertySignature(
      builders.identifier(parameter.name),
      /** @todo get type from swagger */
      builders.tsTypeAnnotation(builders.tsStringKeyword())
    )
  );
  return builders.tsTypeLiteral(paramsPropertySignatures);
}
