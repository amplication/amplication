import * as fs from "fs";
import * as path from "path";
import {
  PathObject,
  OpenAPIObject,
  OperationObject,
  SchemaObject,
} from "openapi3-ts";
import * as t from "@babel/types";
import generate from "@babel/generator";
import template from "@babel/template";
import { Module, relativeImportPath } from "../util/module";
import {
  HTTPMethod,
  getContentSchemaRef,
  resolveRef,
  removeSchemaPrefix,
} from "../util/open-api";
import {
  NamedFunctionDeclaration,
  transformFunctionToClassMethod,
} from "../util/babel";

const serviceTemplatePath = require.resolve("./templates/service/service.ts");
const serviceFindOneTemplatePath = require.resolve(
  "./templates/service/find-one.ts"
);
const serviceFindManyTemplatePath = require.resolve(
  "./templates/service/find-many.ts"
);
const serviceCreateTemplatePath = require.resolve(
  "./templates/service/create.ts"
);

const buildService = template.program(
  fs.readFileSync(serviceTemplatePath, "utf-8"),
  {
    plugins: ["typescript", "decorators-legacy"],
  }
);

const buildFindMany = template.statement(
  fs.readFileSync(serviceFindManyTemplatePath, "utf-8"),
  {
    plugins: ["typescript"],
  }
);

const buildFindOne = template.statement(
  fs.readFileSync(serviceFindOneTemplatePath, "utf-8"),
  {
    plugins: ["typescript"],
  }
);

const buildCreate = template.statement(
  fs.readFileSync(serviceCreateTemplatePath, "utf-8"),
  {
    plugins: ["typescript"],
  }
);

export async function createServiceModule(
  api: OpenAPIObject,
  paths: PathObject,
  entity: string,
  entityType: string,
  entityDTOModule: string
): Promise<Module> {
  const modulePath = path.join(entity, `${entity}.service.ts`);
  const imports: t.ImportDeclaration[] = [];
  const methods: t.ClassMethod[] = [];
  for (const pathSpec of Object.values(paths)) {
    for (const [httpMethod, operation] of Object.entries(pathSpec)) {
      const { method, imports: methodImports } = await getServiceMethod(
        api,
        entityType,
        httpMethod as HTTPMethod,
        operation as OperationObject,
        modulePath
      );
      imports.push(...methodImports);
      methods.push(method);
    }
  }
  const service = buildService({
    ENTITY: entityType,
    ENTITY_DTO_MODULE: relativeImportPath(modulePath, entityDTOModule),
    SERVICE: `${entityType}Service`,
    FIND_ONE_ARGS: `FindOne${entityType}Args`,
    FIND_MANY_ARGS: `FindMany${entityType}Args`,
  });

  service.body.splice(service.body.length - 1, 0, ...imports);

  const exportNamedDeclaration = service.body[
    service.body.length - 1
  ] as t.ExportNamedDeclaration;
  const classDeclaration = exportNamedDeclaration.declaration as t.ClassDeclaration;
  classDeclaration.body.body.push(...methods);

  return {
    path: modulePath,
    code: generate(service, {
      decoratorsBeforeExport: true,
    }).code,
  };
}

async function getServiceMethod(
  api: OpenAPIObject,
  entityType: string,
  method: HTTPMethod,
  operation: OperationObject,
  modulePath: string
): Promise<{ method: t.ClassMethod; imports: t.ImportDeclaration[] }> {
  switch (method) {
    case HTTPMethod.get: {
      const response = operation.responses["200"];
      const ref = getContentSchemaRef(response.content);
      const schema = resolveRef(api, ref) as SchemaObject;
      switch (schema.type) {
        case "object": {
          const methodFunction = buildFindOne({
            DELEGATE: operation["x-entity"],
            ENTITY: entityType,
            ARGS: `FindOne${entityType}Args`,
          }) as NamedFunctionDeclaration;

          return {
            method: transformFunctionToClassMethod(methodFunction),
            imports: [],
          };
        }
        case "array": {
          if (!operation.parameters) {
            throw new Error("operation.parameters must be defined");
          }
          const methodFunction = buildFindMany({
            DELEGATE: operation["x-entity"],
            ENTITY: entityType,
            ARGS: `FindMany${entityType}Args`,
          }) as NamedFunctionDeclaration;

          return {
            method: transformFunctionToClassMethod(methodFunction),
            imports: [],
          };
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
      const methodFunction = buildCreate({
        DELEGATE: operation["x-entity"],
        ENTITY: entityType,
        DATA: bodyType,
      }) as NamedFunctionDeclaration;

      const dtoModule = path.join("dto", bodyType + ".ts");
      const dtoModuleImport = relativeImportPath(modulePath, dtoModule);

      return {
        method: transformFunctionToClassMethod(methodFunction),
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
