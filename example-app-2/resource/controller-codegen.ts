import * as fs from "fs";
import * as path from "path";
import * as recast from "recast";
import * as TypeScriptParser from "recast/parsers/typescript";
import last from "lodash.last";

import {
  OpenAPIObject,
  PathObject,
  OperationObject,
  SchemaObject,
  ParameterObject,
} from "openapi3-ts";
import * as t from "@babel/types";
import {
  createModuleFromTemplate,
  Module,
  readCode,
  relativeImportPath,
  interpolate,
} from "../util/module";
import {
  HTTPMethod,
  getExpressVersion,
  resolveRef,
  getContentSchemaRef,
  removeSchemaPrefix,
} from "../util/open-api";
import generate from "@babel/generator";

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

const findOneTemplate = fs.readFileSync(controllerFindOneTemplatePath, "utf-8");

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
  const imports: t.ImportDeclaration[] = [];
  const methods: string[] = [];
  for (const [path, pathSpec] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(pathSpec)) {
      const controllerMethod = await getControllerMethod(
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
    IMPORTS: generate(t.program(imports)).code,
  });
}

async function getControllerMethod(
  api: OpenAPIObject,
  entityType: string,
  method: HTTPMethod,
  route: string,
  operation: OperationObject,
  modulePath: string
): Promise<{
  code: string;
  imports: t.ImportDeclaration[];
}> {
  if (!api?.components?.schemas) {
    throw new Error("api.components.schemas must be defined");
  }
  /** @todo handle deep paths */
  const [, , parameter] = getExpressVersion(route).split("/");
  switch (method) {
    case HTTPMethod.get: {
      /** @todo use path */
      const response = operation.responses["200"];
      const ref = getContentSchemaRef(response.content);
      const schema = resolveRef(api, ref) as SchemaObject;
      if (!schema) {
        throw new Error(`Invalid ref: ${ref}`);
      }
      switch (schema.type) {
        case "object": {
          if (!operation.summary) {
            throw new Error("operation.summary must be defined");
          }
          const paramsType = createParamsType(operation);

          const ast = recast.parse(findOneTemplate, {
            parser: TypeScriptParser,
          });

          interpolateAST(ast, {
            ENTITY: t.identifier(entityType),
            PATH: t.stringLiteral(parameter),
            QUERY: t.tsTypeLiteral([]),
            PARAMS: paramsType,
          });

          const mixin = last(ast.program.body) as t.Class;
          const method = last(mixin.body.body) as t.ClassMethod;
          t.addComment(method, "leading", `* ${operation.summary}`);

          return { code: recast.print(method).code, imports: [] };
        }
        case "array": {
          const controllerFindManyTemplate = await readCode(
            controllerFindManyTemplatePath
          );
          const code = interpolate(controllerFindManyTemplate, {
            COMMENT: operation.summary,
            ENTITY: entityType,
          });
          return { code, imports: [] };
        }
      }
    }
    case HTTPMethod.post: {
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
      const controllerCreateTemplate = await readCode(
        controllerCreateTemplatePath
      );
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
          t.importDeclaration(
            [t.importSpecifier(t.identifier(bodyType), t.identifier(bodyType))],
            t.stringLiteral(dtoModuleImport)
          ),
        ],
      };
    }
    default: {
      throw new Error(`Unknown method: ${method}`);
    }
  }
}

function createParamsType(operation: OperationObject) {
  if (!operation.parameters) {
    throw new Error("operation.parameters must be defined");
  }
  const pathParameters = operation.parameters.filter(
    (parameter): parameter is ParameterObject =>
      "in" in parameter && parameter.in === "path"
  );
  const paramsPropertySignatures = pathParameters.map((parameter) =>
    t.tsPropertySignature(
      t.identifier(parameter.name),
      /** @todo get type from swagger */
      t.tsTypeAnnotation(t.tsStringKeyword())
    )
  );
  return t.tsTypeLiteral(paramsPropertySignatures);
}

function interpolateAST(ast: t.Node, mapping: { [key: string]: t.Node }): void {
  return recast.visit(ast, {
    visitIdentifier(path) {
      const { name } = path.node;
      if (name in mapping) {
        const replacement = mapping[name];
        path.replace(replacement);
      }
      this.traverse(path);
    },
  });
}
