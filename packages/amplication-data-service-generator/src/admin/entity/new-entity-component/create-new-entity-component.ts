import * as path from "path";
import { builders, namedTypes } from "ast-types";
import { Entity } from "../../../types";
import {
  addImports,
  importContainedIdentifiers,
  importNames,
  interpolate,
} from "../../../util/ast";
import { readFile, relativeImportPath } from "../../../util/module";
import { DTOs } from "../../../server/resource/create-dtos";
import { EntityComponent } from "../../types";
import { createFieldInput } from "../create-field-input";
import { jsxFragment } from "../../util";

const template = path.resolve(__dirname, "new-entity-component.template.tsx");

const IMPORTABLE_IDS = {
  "../user/RoleSelect": [builders.identifier("RoleSelect")],
  "@amplication/design-system": [
    builders.identifier("TextField"),
    builders.identifier("SelectField"),
    builders.identifier("ToggleField"),
  ],
};

export async function createNewEntityComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  entityToPath: Record<string, string>,
  entityToResource: Record<string, string>,
  dtoNameToPath: Record<string, string>
): Promise<EntityComponent> {
  const file = await readFile(template);
  const name = `${entity.name}Create`;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;
  const entityDTO = dtos[entity.name].entity;
  const dto = dtos[entity.name].createInput;
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

  const localEntityDTOId = builders.identifier(`T${entityDTO.id.name}`);

  interpolate(file, {
    COMPONENT_NAME: builders.identifier(name),
    INPUTS: jsxFragment`<>${fields.map((field) => createFieldInput(field))}</>`,
  });

  addImports(file, [...importContainedIdentifiers(file, IMPORTABLE_IDS)]);

  return { name, file, modulePath };
}
