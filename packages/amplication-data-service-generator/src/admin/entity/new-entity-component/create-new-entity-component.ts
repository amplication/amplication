import * as path from "path";
import { builders, namedTypes } from "ast-types";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity, EnumDataType, EntityField } from "../../../types";
import { addImports, importNames, interpolate } from "../../../util/ast";
import { readFile, relativeImportPath } from "../../../util/module";
import { DTOs } from "../../../server/resource/create-dtos";
import { EntityComponent } from "../../types";
import { createFieldInput } from "../create-field-input";
import { jsxFragment } from "../../util";

const template = path.resolve(__dirname, "new-entity-component.template.tsx");

export async function createNewEntityComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  dtoNameToPath: Record<string, string>,
  entityIdToName: Record<string, string>
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

  const relationFields: EntityField[] = [];

  interpolate(file, {
    COMPONENT_NAME: builders.identifier(name),
    ENTITY_NAME: builders.stringLiteral(entity.displayName),
    RESOURCE: builders.stringLiteral(paramCase(plural(entity.name))),
    ENTITY: entityDTO.id,
    CREATE_INPUT: dto.id,
    INPUTS: jsxFragment`<>${dtoProperties.map((property) => {
      const field = fieldsByName[property.key.name];
      if (field.dataType === EnumDataType.Lookup) relationFields.push(field);
      return createFieldInput(field, entityIdToName);
    })}</>`,
  });

  //add imports for EntitySelect fields
  addImports(
    file,
    relationFields.map((field) => {
      const relatedEntityName =
        entityIdToName[field.properties.relatedEntityId];
      console.log("import select", entity.name, field.name, relatedEntityName);
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
