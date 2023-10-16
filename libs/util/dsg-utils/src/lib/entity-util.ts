import pluralize from "pluralize";
import { camelCase } from "camel-case";

//returns the plural name of the entity, based on its name, in a camelCase format
//in case the plural name is the same as the name, it adds the suffix "Items"
export const prepareEntityPluralName = (entityName: string): string => {
  let pluralName = pluralize(camelCase(entityName));

  pluralName =
    pluralName === camelCase(entityName) ? `${pluralName}Items` : pluralName;
  return pluralName;
};
