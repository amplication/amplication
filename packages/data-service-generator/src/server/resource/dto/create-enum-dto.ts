import { namedTypes, builders } from "ast-types";
import { pascalCase } from "pascal-case";
import { types, EntityField, Entity } from "@amplication/code-gen-types";

import { createEnumName } from "../../prisma/create-prisma-schema-fields";

export type StringLiteralEnumMember = namedTypes.TSEnumMember & {
  initializer: namedTypes.StringLiteral;
};

export function createEnumDTO(
  field: EntityField,
  entity: Entity
): namedTypes.TSEnumDeclaration {
  const members = createEnumMembers(field);
  return builders.tsEnumDeclaration(
    builders.identifier(createEnumName(field, entity)),
    members
  );
}

export function createEnumMembers(
  field: EntityField
): StringLiteralEnumMember[] {
  const properties = field.properties as
    | types.MultiSelectOptionSet
    | types.OptionSet;
  return properties.options.map(
    (option) =>
      builders.tsEnumMember(
        builders.identifier(createEnumMemberName(option.label)),
        builders.stringLiteral(option.value)
      ) as StringLiteralEnumMember
  );
}

export function createEnumMemberName(name: string): string {
  return pascalCase(name);
}
