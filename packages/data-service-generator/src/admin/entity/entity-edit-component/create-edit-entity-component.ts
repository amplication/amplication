import * as path from "path";
import { builders } from "ast-types";
import { isEmpty } from "lodash";
import {
  Entity,
  EnumDataType,
  EntityField,
  LookupResolvedProperties,
} from "@amplication/code-gen-types";
import {
  addImports,
  getNamedProperties,
  importContainedIdentifiers,
  importNames,
  interpolate,
} from "../../../utils/ast";
import { relativeImportPath } from "../../../utils/module";
import { readFile } from "@amplication/code-gen-utils";
import { EntityComponent } from "../../types";
import { createFieldInput } from "../create-field-input";
import { jsxFragment } from "../../util";

import {
  REACT_ADMIN_MODULE,
  REACT_ADMIN_COMPONENTS_ID,
} from "../react-admin.util";
import DsgContext from "../../../dsg-context";
const IMPORTABLE_IDS = {
  "../user/RolesOptions": [builders.identifier("ROLES_OPTIONS")],
  [REACT_ADMIN_MODULE]: REACT_ADMIN_COMPONENTS_ID,
};
const template = path.resolve(__dirname, "entity-edit-component.template.tsx");

export async function createEditEntityComponent(
  entity: Entity,
  entityToDirectory: Record<string, string>,
  entityToTitleComponent: Record<string, EntityComponent>
): Promise<EntityComponent> {
  const name = `${entity.name}Edit`;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DTOs } = DsgContext.getInstance;
  const dto = DTOs[entity.name].updateInput;
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
