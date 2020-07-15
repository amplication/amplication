import * as fs from "fs";
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
  createModuleFromTemplate,
  Module,
  readCode,
  relativeImportPath,
  interpolate,
  interpolateAST,
  docComment,
  getMethodFromTemplateAST,
  parse,
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
  const methods: string[] = [];
  for (const [path, pathSpec] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(pathSpec)) {
      const controllerMethod = await createControllerMethod(
        api,
        entityType,
        method as HTTPMethod,
        path,
        operation as OperationObject,
        modulePath
      );
      methods.push(controllerMethod.code);
      imports.push(...controllerMethod.imports);
    }
  }

  return createModuleFromTemplate(modulePath, controllerTemplatePath, {
    RESOURCE: resource,
    ENTITY: entityType,
    ENTITY_DTO_MODULE: relativeImportPath(modulePath, entityDTOModule),
    ENTITY_SERVICE_MODULE: relativeImportPath(modulePath, entityServiceModule),
    METHODS: methods.join("\n"),
    IMPORTS: recast.print(builders.program(imports)).code,
  });
}

async function createControllerMethod(
  api: OpenAPIObject,
  entityType: string,
  method: HTTPMethod,
  route: string,
  operation: OperationObject,
  modulePath: string
): Promise<{
  code: string;
  imports: namedTypes.ImportDeclaration[];
}> {
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

  interpolateAST(ast, {
    ENTITY: builders.identifier(entityType),
    PATH: builders.stringLiteral(parameter),
    /** @todo use operation query parameters */
    QUERY: builders.tsTypeLiteral([]),
    PARAMS: createParamsType(operation),
  });

  const method = getMethodFromTemplateAST(ast);
  method.comments = [docComment(operation.summary)];

  return { code: recast.print(method).code, imports: [] };
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

  return { code: recast.print(method).code, imports: [] };
}

async function createCreate(
  operation: OperationObject,
  entityType: string,
  modulePath: string
) {
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
  const controllerCreateTemplate = await readCode(controllerCreateTemplatePath);
  const code = interpolate(controllerCreateTemplate, {
    COMMENT: operation.summary,
    ENTITY: entityType,
    BODY_TYPE: bodyType,
  });
  const dtoModule = path.join("dto", bodyType + ".ts");
  const dtoModuleImport = relativeImportPath(modulePath, dtoModule);
  return {
    code,
    imports: [
      builders.importDeclaration(
        [builders.importSpecifier(builders.identifier(bodyType))],
        builders.stringLiteral(dtoModuleImport)
      ),
    ],
  };
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
