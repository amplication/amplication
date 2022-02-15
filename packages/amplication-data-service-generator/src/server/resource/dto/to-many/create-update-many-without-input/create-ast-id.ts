import { builders, namedTypes } from "ast-types";
import { pascalCase } from "pascal-case";
export function createUpdateManyWithoutInputID(
  pluralEntityName: string,
  nestedEntityName: string
): namedTypes.Identifier {
  return builders.identifier(
    `${pascalCase(nestedEntityName)}UpdateManyWithout${pascalCase(
      pluralEntityName
    )}Input`
  );
}
