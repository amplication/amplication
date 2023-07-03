import { builders, namedTypes } from "ast-types";
import { isEmpty } from "lodash";
import * as path from "path";
import {
  Entity,
  EntityField,
  EnumDataType,
  LookupResolvedProperties,
} from "@amplication/code-gen-types";
import {
  addImports,
  importContainedIdentifiers,
  importNames,
  interpolate,
} from "../../../utils/ast";
import { relativeImportPath } from "../../../utils/module";
import { EntityComponent } from "../../types";
import { jsxFragment } from "../../util";
import { createFieldInput } from "../create-field-input";
import {
  REACT_ADMIN_COMPONENTS_ID,
  REACT_ADMIN_MODULE,
} from "../react-admin.util";
import DsgContext from "../../../dsg-context";
import { readFile } from "@amplication/code-gen-utils";
const template = path.resolve(
  __dirname,
  "entity-create-component.template.tsx"
);

const IMPORTABLE_IDS = {
  "../user/RolesOptions": [builders.identifier("ROLES_OPTIONS")],
  [REACT_ADMIN_MODULE]: REACT_ADMIN_COMPONENTS_ID,
};

export async function createEntityCreateComponent(
  entity: Entity,
  entityToDirectory: Record<string, string>,
  entityToTitleComponent: Record<string, EntityComponent>
): Promise<EntityComponent> {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { DTOs } = DsgContext.getInstance;
  const file = await readFile(template);
  const name = `${entity.name}Create`;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;
  const dto = DTOs[entity.name].createInput;
  const dtoProperties = dto.body.body.filter(
    (
      member
    ): member is namedTypes.ClassProperty & { key: namedTypes.Identifier } =>
      namedTypes.ClassProperty.check(member) &&
      namedTypes.Identifier.check(member.key)
  );
  const fieldsByName = Object.fromEntries(
    entity.fields.map((field) => [field.name, field])
  );
  const fields = dtoProperties.map(
    (property) => fieldsByName[property.key.name]
  );
  const relationFields: EntityField[] = fields.filter(
    (field) => field.dataType === EnumDataType.Lookup
  );

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
