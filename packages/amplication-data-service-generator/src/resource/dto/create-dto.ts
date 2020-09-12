import { print } from "recast";
import { namedTypes, builders } from "ast-types";
import { FullEntity } from "../../types";
import { Module } from "../../util/module";

export function createDTOModules(entity: FullEntity): Module[] {
  const dtos = [
    createCreateInput(entity),
    createUpdateInput(entity),
    createWhereInput(entity),
    createWhereUniqueInput(entity),
  ];
  return dtos.map((dto) => {
    const program = builders.program([builders.exportNamedDeclaration(dto)]);
    return {
      code: print(program).code,
      /** @todo lower case entity directory */
      path: `${entity.name}/${dto.id?.name}`,
    };
  });
}

const UNEDITABLE_FIELDS = new Set<string>(["id", "createdAt", "updatedAt"]);

export function createCreateInput(
  entity: FullEntity
): namedTypes.ClassDeclaration {
  const properties = entity.fields
    .filter((field) => !UNEDITABLE_FIELDS.has(field.name))
    .map((field) => {
      const type = builders.tsNullKeyword();
      return builders.tsPropertySignature(
        builders.identifier(field.name),
        builders.tsTypeAnnotation(type)
      );
    });
  return builders.classDeclaration(
    builders.identifier(`${entity.name}CreateInput`),
    builders.classBody(properties)
  );
}

export function createUpdateInput(
  entity: FullEntity
): namedTypes.ClassDeclaration {
  const properties = entity.fields
    .filter((field) => !UNEDITABLE_FIELDS.has(field.name))
    .map((field) => {
      const type = builders.tsNullKeyword();
      return builders.tsPropertySignature(
        builders.identifier(field.name),
        builders.tsTypeAnnotation(type)
      );
    });
  return builders.classDeclaration(
    builders.identifier(`${entity.name}UpdateInput`),
    builders.classBody(properties)
  );
}

export function createWhereInput(
  entity: FullEntity
): namedTypes.ClassDeclaration {
  const properties = entity.fields
    .filter((field) => field.name)
    .map((field) => {
      const type = builders.tsNullKeyword();
      return builders.tsPropertySignature(
        builders.identifier(field.name),
        builders.tsTypeAnnotation(type)
      );
    });
  return builders.classDeclaration(
    builders.identifier(`${entity.name}WhereInput`),
    builders.classBody(properties)
  );
}

export function createWhereUniqueInput(
  entity: FullEntity
): namedTypes.ClassDeclaration {
  const properties = entity.fields.map((field) => {
    const type = builders.tsNullKeyword();
    return builders.tsPropertySignature(
      builders.identifier(field.name),
      builders.tsTypeAnnotation(type)
    );
  });
  return builders.classDeclaration(
    builders.identifier(`${entity.name}WhereUniqueInput`),
    builders.classBody(properties)
  );
}
