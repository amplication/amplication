import { print } from "recast";
import { builders, namedTypes } from "ast-types";
import { Module, Entity, EnumDataType } from "../../../types";
import { readFile, relativeImportPath } from "../../../util/module";
import {
  interpolate,
  removeTSIgnoreComments,
  removeTSVariableDeclares,
  removeTSInterfaceDeclares,
  addImports,
  importNames,
  findClassDeclarationById,
  findConstructor,
  removeESLintComments,
} from "../../../util/ast";
import { SRC_DIRECTORY } from "../../constants";

const ARGS_ID = builders.identifier("args");
const DATA_ID = builders.identifier("data");
const PASSWORD_SERVICE_ID = builders.identifier("PasswordService");
const PASSWORD_SERVICE_MEMBER_ID = builders.identifier("passwordService");
const PASSWORD_SERVICE_MODULE_PATH = "auth/password.service.ts";
const HASH_ID = builders.identifier("hash");

const serviceTemplatePath = require.resolve("./service.template.ts");

export async function createServiceModule(
  entityName: string,
  entityType: string,
  entity: Entity
): Promise<Module> {
  const modulePath = `${SRC_DIRECTORY}/${entityName}/${entityName}.service.ts`;
  const file = await readFile(serviceTemplatePath);
  const serviceId = createServiceId(entityType);
  const passwordMappings = createPasswordMappings(entity);

  interpolate(file, {
    SERVICE: serviceId,
    ENTITY: builders.identifier(entityType),
    CREATE_ARGS: builders.identifier(`${entityType}CreateArgs`),
    FIND_MANY_ARGS: builders.identifier(`FindMany${entityType}Args`),
    FIND_ONE_ARGS: builders.identifier(`FindOne${entityType}Args`),
    UPDATE_ARGS: builders.identifier(`${entityType}UpdateArgs`),
    DELETE_ARGS: builders.identifier(`${entityType}DeleteArgs`),
    DELEGATE: builders.identifier(entityName),
    CREATE_ARGS_MAPPING: createDataMapping(passwordMappings),
    UPDATE_ARGS_MAPPING: createDataMapping(passwordMappings),
  });

  if (passwordMappings.length) {
    addImports(file, [
      importNames(
        [PASSWORD_SERVICE_ID],
        relativeImportPath(modulePath, PASSWORD_SERVICE_MODULE_PATH)
      ),
    ]);
    const classDeclaration = findClassDeclarationById(file, serviceId);
    if (!classDeclaration) {
      throw new Error(`Could not find ${serviceId.name}`);
    }
    const constructor = findConstructor(classDeclaration);
    if (!constructor) {
      throw new Error("Could not find constructor");
    }
    constructor.params.push(
      builders.tsParameterProperty.from({
        accessibility: "private",
        parameter: builders.identifier.from({
          name: PASSWORD_SERVICE_MEMBER_ID.name,
          typeAnnotation: builders.tsTypeAnnotation(
            builders.tsTypeReference(PASSWORD_SERVICE_ID)
          ),
        }),
      })
    );
  }

  removeTSIgnoreComments(file);
  removeESLintComments(file);
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);

  return {
    path: modulePath,
    code: print(file).code,
  };
}

function createDataMapping(
  mappings: namedTypes.ObjectProperty[]
): namedTypes.Identifier | namedTypes.ObjectExpression {
  if (!mappings.length) {
    return ARGS_ID;
  }
  return builders.objectExpression([
    builders.spreadProperty(ARGS_ID),
    builders.objectProperty(
      DATA_ID,
      builders.objectExpression([
        builders.spreadProperty(builders.memberExpression(ARGS_ID, DATA_ID)),
        ...mappings,
      ])
    ),
  ]);
}

function createPasswordMappings(entity: Entity): namedTypes.ObjectProperty[] {
  const passwordFields = entity.fields.filter(
    (field) => field.dataType === EnumDataType.Password
  );
  return passwordFields.map((field) => {
    const fieldId = builders.identifier(field.name);
    return builders.objectProperty(
      fieldId,
      builders.awaitExpression(
        builders.callExpression(
          builders.memberExpression(
            builders.memberExpression(
              builders.thisExpression(),
              PASSWORD_SERVICE_MEMBER_ID
            ),
            HASH_ID
          ),
          [
            builders.memberExpression(
              builders.memberExpression(ARGS_ID, DATA_ID),
              fieldId
            ),
          ]
        )
      )
    );
  });
}

export function createServiceId(entityType: string): namedTypes.Identifier {
  return builders.identifier(`${entityType}Service`);
}
