import * as path from "path";
import { builders } from "ast-types";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity, EnumDataType, EntityField } from "../../../types";
import {
  addImports,
  getNamedProperties,
  importNames,
  interpolate,
} from "../../../util/ast";
import { readFile, relativeImportPath } from "../../../util/module";
import { DTOs } from "../../../server/resource/create-dtos";
import { EntityComponent } from "../../types";
import { createFieldInput } from "../create-field-input";
import { jsxFragment } from "../../util";

const template = path.resolve(__dirname, "entity-component.template.tsx");

export async function createEntityComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  dtoNameToPath: Record<string, string>,
  entityIdToName: Record<string, string>
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

  const relationFields: EntityField[] = [];

  interpolate(file, {
    COMPONENT_NAME: builders.identifier(name),
    ENTITY_NAME: builders.stringLiteral(entity.displayName),
    RESOURCE: builders.stringLiteral(paramCase(plural(entity.name))),
    ENTITY: localEntityDTOId,
    UPDATE_INPUT: dto.id,
    INPUTS: jsxFragment`<>${dtoProperties.map((property) => {
      const field = fieldsByName[property.key.name];
      if (field.dataType === EnumDataType.Lookup) relationFields.push(field);
      return createFieldInput(field, entityIdToName);
    })}</>`,
    EDITABLE_PROPERTIES: builders.arrayExpression(
      dtoProperties.map((property) => builders.stringLiteral(property.key.name))
    ),
  });

  //add imports for EntitySelect fields
  addImports(
    file,
    relationFields.map((field) => {
      const relatedEntityName =
        entityIdToName[field.properties.relatedEntityId];
      return importNames(
        [builders.identifier(`${relatedEntityName}Select`)],
        relativeImportPath(
          modulePath,
          `${entityToDirectory[relatedEntityName]}/${relatedEntityName}Select.tsx`
        )
      );
    })
  );

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
