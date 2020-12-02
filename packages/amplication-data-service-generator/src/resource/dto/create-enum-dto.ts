import { namedTypes, builders } from "ast-types";
import { pascalCase } from "pascal-case";
import { types } from "@amplication/data";
import { EntityField } from "../../types";
import { createEnumName } from "../../prisma/create-prisma-schema";

export type StringLiteralEnumMember = namedTypes.TSEnumMember & {
  initializer: namedTypes.StringLiteral;
};

export function createEnumDTO(
  field: EntityField
): namedTypes.TSEnumDeclaration {
  const members = createEnumMembers(field);
  return builders.tsEnumDeclaration(
    builders.identifier(createEnumName(field)),
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
        builders.identifier(pascalCase(option.label)),
        builders.stringLiteral(option.value)
      ) as StringLiteralEnumMember
  );
}
