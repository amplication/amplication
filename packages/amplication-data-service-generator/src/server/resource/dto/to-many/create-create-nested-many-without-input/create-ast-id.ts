import { builders, namedTypes } from "ast-types";
import { pascalCase } from "pascal-case";
export function createCreateNestedManyWithoutInputID(
  pluralEntityName: string,
  nestedEntityName: string
): namedTypes.Identifier {
  return builders.identifier(
    `${pascalCase(nestedEntityName)}CreateNestedManyWithout${pascalCase(
      pluralEntityName
    )}Input`
  );
}
