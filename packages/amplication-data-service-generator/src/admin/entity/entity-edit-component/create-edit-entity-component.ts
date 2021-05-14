import * as path from "path";
import { builders } from "ast-types";
import { isEmpty } from "lodash";
import {
  Entity,
  EnumDataType,
  EntityField,
  LookupResolvedProperties,
} from "../../../types";
import {
  addImports,
  getNamedProperties,
  importContainedIdentifiers,
  importNames,
  interpolate,
} from "../../../util/ast";
import { readFile, relativeImportPath } from "../../../util/module";
import { DTOs } from "../../../server/resource/create-dtos";
import { EntityComponent } from "../../types";
import { createFieldInput } from "../create-field-input";
import { jsxFragment } from "../../util";

import {
  REACT_ADMIN_MODULE,
  REACT_ADMIN_COMPONENTS_ID,
} from "../react-admin.util";
const IMPORTABLE_IDS = {
  "../user/RolesOptions": [builders.identifier("ROLES_OPTIONS")],
  [REACT_ADMIN_MODULE]: REACT_ADMIN_COMPONENTS_ID,
};
const template = path.resolve(__dirname, "entity-edit-component.template.tsx");

export async function createEditEntityComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  entityToTitleComponent: Record<string, EntityComponent>
): Promise<EntityComponent> {
  const name = `${entity.name}Edit`;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;
  const dto = dtos[entity.name].updateInput;
  const dtoProperties = getNamedProperties(dto);
  const fieldsByName = Object.fromEntries(
    entity.fields.map((field) => [field.name, field])
  );
  const fields = dtoProperties.map(
    (property) => fieldsByName[property.key.name]
  );
  const relationFields: EntityField[] = fields.filter(
    (field) => field.dataType === EnumDataType.Lookup
  );

  const file = await readFile(template);

  interpolate(file, {
    COMPONENT_NAME: builders.identifier(name),
    INPUTS: jsxFragment`<>${
      isEmpty(fields)
        ? "<div/>" //create an empty div if no fields exist - <SimpleForm> {children} must not be empty
        : fields.map((field) => createFieldInput(field))
    }</>`,
  });

  // Add imports for entities title components
  addImports(
    file,
    relationFields.map((field) => {
      const { relatedEntity } = field.properties as LookupResolvedProperties;
      const relatedEntityTitleComponent =
        entityToTitleComponent[relatedEntity.name];
      return importNames(
        [builders.identifier(relatedEntityTitleComponent.name)],
        relativeImportPath(modulePath, relatedEntityTitleComponent.modulePath)
      );
    })
  );

  addImports(file, [...importContainedIdentifiers(file, IMPORTABLE_IDS)]);

  return { name, file, modulePath };
}
