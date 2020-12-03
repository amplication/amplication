import * as path from "path";
import { builders, namedTypes } from "ast-types";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity } from "../../../types";
import { addImports, importNames, interpolate } from "../../../util/ast";
import { readFile, relativeImportPath } from "../../../util/module";
import { DTOs } from "../../../resource/create-dtos";
import { EntityComponent } from "../../types";
import { createFieldInput } from "../create-field-input";

const template = path.resolve(__dirname, "new-entity-component.template.tsx");

export async function createNewEntityComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  dtoNameToPath: Record<string, string>
): Promise<EntityComponent> {
  const file = await readFile(template);
  const name = `Create${entity.name}`;
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
  interpolate(file, {
    COMPONENT_NAME: builders.identifier(name),
    ENTITY_NAME: builders.stringLiteral(entity.displayName),
    RESOURCE: builders.stringLiteral(paramCase(plural(entity.name))),
    ENTITY: entityDTO.id,
    CREATE_INPUT: dto.id,
    INPUTS: builders.jsxFragment(
      builders.jsxOpeningFragment(),
      builders.jsxClosingFragment(),
      dtoProperties.map((property) => {
        const field = fieldsByName[property.key.name];
        return createFieldInput(field);
      })
    ),
  });
  addImports(file, [
    importNames(
      [entityDTO.id],
      relativeImportPath(modulePath, dtoNameToPath[entityDTO.id.name])
    ),
    importNames(
      [dto.id],
      relativeImportPath(modulePath, dtoNameToPath[dto.id.name])
    ),
  ]);

  return { name, file, modulePath };
}
