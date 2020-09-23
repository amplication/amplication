import { print } from "recast";
import { namedTypes, builders } from "ast-types";
import { TSTypeKind } from "ast-types/gen/kinds";
import {
  FieldKind,
  ObjectField,
  ScalarField,
  ScalarType,
} from "prisma-schema-dsl";
import { camelCase } from "camel-case";
import { Entity, EntityField, EnumDataType } from "../../types";
import { Module, relativeImportPath } from "../../util/module";
import { createPrismaField } from "../../prisma/create-prisma-schema";
import {
  addImports,
  importContainedIdentifiers,
  classProperty,
} from "../../util/ast";

type NamedClassDeclaration = namedTypes.ClassDeclaration & {
  id: namedTypes.Identifier;
};

const UNEDITABLE_FIELDS = new Set<string>(["id", "createdAt", "updatedAt"]);

const PRISMA_SCALAR_TO_TYPE: {
  [scalar in ScalarType]: TSTypeKind;
} = {
  [ScalarType.Boolean]: builders.tsBooleanKeyword(),
  [ScalarType.DateTime]: builders.tsTypeReference(builders.identifier("Date")),
  [ScalarType.Float]: builders.tsNumberKeyword(),
  [ScalarType.Int]: builders.tsNumberKeyword(),
  [ScalarType.String]: builders.tsStringKeyword(),
  [ScalarType.Json]: builders.tsUnknownKeyword(),
};
export const CLASS_VALIDATOR_MODULE = "class-validator";
export const CLASS_TRANSFORMER_MODULE = "class-transformer";
export const IS_BOOLEAN_ID = builders.identifier("IsBoolean");
export const IS_DATE_ID = builders.identifier("IsDate");
export const IS_NUMBER_ID = builders.identifier("IsNumber");
export const IS_INT_ID = builders.identifier("IsInt");
export const IS_STRING_ID = builders.identifier("IsString");
export const IS_OPTIONAL_ID = builders.identifier("IsOptional");
export const VALIDATE_NESTED_ID = builders.identifier("ValidateNested");
export const TYPE_ID = builders.identifier("Type");
export const IMPORTABLE_NAMES: Record<string, namedTypes.Identifier[]> = {
  [CLASS_VALIDATOR_MODULE]: [
    IS_BOOLEAN_ID,
    IS_DATE_ID,
    IS_NUMBER_ID,
    IS_INT_ID,
    IS_STRING_ID,
    IS_OPTIONAL_ID,
    VALIDATE_NESTED_ID,
  ],
  [CLASS_TRANSFORMER_MODULE]: [TYPE_ID],
};

const PRISMA_SCALAR_TO_DECORATOR_ID: {
  [scalar in ScalarType]: namedTypes.Identifier | null;
} = {
  [ScalarType.Boolean]: IS_BOOLEAN_ID,
  [ScalarType.DateTime]: IS_DATE_ID,
  [ScalarType.Float]: IS_NUMBER_ID,
  [ScalarType.Int]: IS_INT_ID,
  [ScalarType.String]: IS_STRING_ID,
  [ScalarType.Json]: null,
};

export function createDTOModules(
  entity: Entity,
  entityName: string,
  entityIdToName: Record<string, string>
): Module[] {
  const dtos = [
    createCreateInput(entity, entityIdToName),
    createUpdateInput(entity, entityIdToName),
    createWhereInput(entity, entityIdToName),
    createWhereUniqueInput(entity, entityIdToName),
    createEntityDTO(entity, entityIdToName),
  ];
  const entityNames = Object.values(entityIdToName);
  return dtos.map((dto) => createDTOModule(dto, entityName, entityNames));
}

export function createDTOModule(
  dto: NamedClassDeclaration,
  entityName: string,
  entityNames: string[]
): Module {
  const modulePath = createDTOModulePath(entityName, dto.id.name);
  return {
    code: print(createDTOFile(dto, modulePath, entityNames)).code,
    path: modulePath,
  };
}

export function createDTOFile(
  dto: namedTypes.ClassDeclaration,
  modulePath: string,
  entityNames: string[]
): namedTypes.File {
  const file = builders.file(
    builders.program([builders.exportNamedDeclaration(dto)])
  );
  const moduleToIds = {
    ...IMPORTABLE_NAMES,
    ...getEntityModuleToDTOIds(modulePath, entityNames),
  };

  addImports(file, importContainedIdentifiers(dto, moduleToIds));

  return file;
}

export function getEntityModuleToDTOIds(
  modulePath: string,
  entityNames: string[]
): Record<string, namedTypes.Identifier[]> {
  return Object.fromEntries(
    entityNames
      /** @todo use mapping from entity to directory */
      .map((name) => [name, createDTOModulePath(camelCase(name), name)])
      .filter(([, dtoModulePath]) => dtoModulePath !== modulePath)
      .map(([name, dtoModulePath]) => {
        const dtoId = builders.identifier(name);
        return [relativeImportPath(modulePath, dtoModulePath), [dtoId]];
      })
  );
}

export function createDTOModulePath(
  entityName: string,
  dtoName: string
): string {
  return `${entityName}/${dtoName}.ts`;
}

export function createCreateInput(
  entity: Entity,
  entityIdToName: Record<string, string>
): NamedClassDeclaration {
  const properties = entity.fields
    .filter(isEditableField)
    /** @todo support create inputs */
    .map((field) =>
      createFieldClassProperty(field, !field.required, entityIdToName)
    );
  return builders.classDeclaration(
    createCreateInputID(entity.name),
    builders.classBody(properties)
  ) as NamedClassDeclaration;
}

export function createCreateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}CreateInput`);
}

export function createUpdateInput(
  entity: Entity,
  entityIdToName: Record<string, string>
): NamedClassDeclaration {
  const properties = entity.fields
    .filter(isEditableField)
    /** @todo support create inputs */
    .map((field) => createFieldClassProperty(field, true, entityIdToName));
  return builders.classDeclaration(
    createUpdateInputID(entity.name),
    builders.classBody(properties)
  ) as NamedClassDeclaration;
}

export function createUpdateInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}UpdateInput`);
}

export function createWhereUniqueInput(
  entity: Entity,
  entityIdToName: Record<string, string>
): NamedClassDeclaration {
  const uniqueFields = entity.fields.filter(isUniqueField);
  const properties = uniqueFields.map((field) =>
    createFieldClassProperty(field, false, entityIdToName)
  );
  return builders.classDeclaration(
    createWhereUniqueInputID(entity.name),
    builders.classBody(properties)
  ) as NamedClassDeclaration;
}

export function createWhereUniqueInputID(
  entityName: string
): namedTypes.Identifier {
  return builders.identifier(`${entityName}WhereUniqueInput`);
}

export function createWhereInput(
  entity: Entity,
  entityIdToName: Record<string, string>
): NamedClassDeclaration {
  const properties = entity.fields
    .filter((field) => isQueryableField(field))
    /** @todo support filters */
    .map((field) => createFieldClassProperty(field, true, entityIdToName));
  return builders.classDeclaration(
    createWhereInputID(entity.name),
    builders.classBody(properties)
  ) as NamedClassDeclaration;
}

export function createWhereInputID(entityName: string): namedTypes.Identifier {
  return builders.identifier(`${entityName}WhereInput`);
}

export function createEntityDTO(
  entity: Entity,
  entityIdToName: Record<string, string>
): NamedClassDeclaration {
  const properties = entity.fields.map((field) =>
    createFieldClassProperty(field, !field.required, entityIdToName)
  );
  return builders.classDeclaration(
    builders.identifier(entity.name),
    builders.classBody(properties)
  ) as NamedClassDeclaration;
}

function isUniqueField(field: EntityField): boolean {
  return field.dataType === EnumDataType.Id;
}

function isEditableField(field: EntityField): boolean {
  return !UNEDITABLE_FIELDS.has(field.name) && isScalarField(field);
}

function isQueryableField(field: EntityField): boolean {
  return isScalarField(field);
}

function isScalarField(field: EntityField): boolean {
  return field.dataType !== EnumDataType.Lookup;
}

export function createFieldClassProperty(
  field: EntityField,
  optional: boolean,
  entityIdToName: Record<string, string>
): namedTypes.ClassProperty {
  const prismaField = createPrismaField(field, entityIdToName);
  const id = builders.identifier(field.name);
  const type = createFieldValueTypeFromPrismaField(prismaField);
  const typeAnnotation = builders.tsTypeAnnotation(type);
  let definitive = !optional;
  const decorators: namedTypes.Decorator[] = [];

  if (prismaField.isList && prismaField.kind === FieldKind.Object) {
    definitive = false;
    optional = true;
  }

  if (prismaField.kind === FieldKind.Scalar) {
    const id = PRISMA_SCALAR_TO_DECORATOR_ID[prismaField.type];
    if (id) {
      const args = prismaField.isList
        ? [
            builders.objectExpression([
              builders.objectProperty(
                builders.identifier("each"),
                builders.booleanLiteral(true)
              ),
            ]),
          ]
        : [];
      decorators.push(builders.decorator(builders.callExpression(id, args)));
    }
  }
  if (prismaField.kind === FieldKind.Object) {
    decorators.push(
      builders.decorator(builders.callExpression(VALIDATE_NESTED_ID, [])),
      builders.decorator(
        builders.callExpression(TYPE_ID, [
          builders.arrowFunctionExpression(
            [],
            builders.identifier(prismaField.type)
          ),
        ])
      )
    );
  }
  if (optional) {
    decorators.push(
      builders.decorator(builders.callExpression(IS_OPTIONAL_ID, []))
    );
  }
  return classProperty(
    id,
    typeAnnotation,
    definitive,
    optional,
    null,
    decorators
  );
}

function createFieldValueTypeFromPrismaField(
  prismaField: ScalarField | ObjectField
): TSTypeKind {
  if (prismaField.isList) {
    return builders.tsArrayType(
      createFieldValueTypeFromPrismaField({
        ...prismaField,
        isList: false,
      })
    );
  }
  return prismaField.kind === FieldKind.Scalar
    ? PRISMA_SCALAR_TO_TYPE[prismaField.type]
    : /** @todo add import */
      builders.tsTypeReference(builders.identifier(prismaField.type));
}
