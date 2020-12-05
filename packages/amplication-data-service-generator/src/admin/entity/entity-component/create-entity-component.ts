import * as path from "path";
import { builders } from "ast-types";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity } from "../../../types";
import {
  addImports,
  getNamedProperties,
  importNames,
  interpolate,
} from "../../../util/ast";
import { readFile, relativeImportPath } from "../../../util/module";
import { DTOs } from "../../../resource/create-dtos";
import { EntityComponent } from "../../types";
import { createFieldValue } from "../create-field-value";
import { createFieldInput } from "../create-field-input";
import { jsxElement, jsxFragment } from "../../util";

const template = path.resolve(__dirname, "entity-component.template.tsx");

const DATA_ID = builders.identifier("data");

export async function createEntityComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  dtoNameToPath: Record<string, string>
): Promise<EntityComponent> {
  const name = entity.name;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;
  const entityDTO = dtos[entity.name].entity;
  const dto = dtos[entity.name].updateInput;
  const dtoProperties = getNamedProperties(dto);
  const fieldsByName = Object.fromEntries(
    entity.fields.map((field) => [field.name, field])
  );
  const localEntityDTOId = builders.identifier(`T${entityDTO.id.name}`);
  const file = await readFile(template);
  interpolate(file, {
    COMPONENT_NAME: builders.identifier(name),
    ENTITY_NAME: builders.stringLiteral(entity.displayName),
    RESOURCE: builders.stringLiteral(paramCase(plural(entity.name))),
    ENTITY: localEntityDTOId,
    UPDATE_INPUT: dto.id,
    FIELDS: jsxFragment`<>${dtoProperties.map((property) => {
      const field = fieldsByName[property.key.name];
      return jsxElement`<div>
          <label>${field.displayName}</label>{" "}
          ${createFieldValue(field, DATA_ID)}
        </div>`;
    })}</>`,
    INPUTS: jsxFragment`<>${dtoProperties.map((property) => {
      const field = fieldsByName[property.key.name];
      return createFieldInput(field);
    })}</>`,
    EDITABLE_PROPERTIES: builders.arrayExpression(
      dtoProperties.map((property) => builders.stringLiteral(property.key.name))
    ),
  });

  addImports(file, [
    builders.importDeclaration(
      [builders.importSpecifier(entityDTO.id, localEntityDTOId)],
      builders.stringLiteral(
        relativeImportPath(modulePath, dtoNameToPath[entityDTO.id.name])
      )
    ),
    importNames(
      [dto.id],
      relativeImportPath(modulePath, dtoNameToPath[dto.id.name])
    ),
  ]);

  return { name, file, modulePath };
}
