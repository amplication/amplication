import * as path from "path";
import { builders } from "ast-types";
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
import { getEntityTitleField } from "../entity-title-component/create-entity-title-component";

const template = path.resolve(__dirname, "entity-component.template.tsx");
const IMPORTABLE_IDS = {
  "../user/RoleSelect": [builders.identifier("RoleSelect")],
  "@amplication/design-system": [
    builders.identifier("TextField"),
    builders.identifier("SelectField"),
    builders.identifier("ToggleField"),
  ],
};

export async function createEntityComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  entityToPath: Record<string, string>,
  entityToResource: Record<string, string>,
  dtoNameToPath: Record<string, string>,
  entityToSelectComponent: Record<string, EntityComponent>
): Promise<EntityComponent> {
  const name = `View${entity.name}`;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;
  const resource = entityToResource[entity.name];
  const path = entityToPath[entity.name];
  const entityDTO = dtos[entity.name].entity;
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
  const localEntityDTOId = builders.identifier(`T${entityDTO.id.name}`);
  const file = await readFile(template);

  interpolate(file, {
    COMPONENT_NAME: builders.identifier(name),
    ENTITY_NAME: builders.stringLiteral(entity.displayName),
    RESOURCE: builders.stringLiteral(resource),
    PATH: builders.stringLiteral(path),
    ENTITY: localEntityDTOId,
    UPDATE_INPUT: dto.id,
    ENTITY_TITLE_FIELD: builders.identifier(getEntityTitleField(entity)),
    INPUTS: jsxFragment`<>${fields.map((field) =>
      createFieldInput(field, entityToSelectComponent)
    )}</>`,
    EDITABLE_PROPERTIES: builders.arrayExpression(
      dtoProperties.map((property) => builders.stringLiteral(property.key.name))
    ),
  });

  //add imports for EntitySelect fields
  addImports(
    file,
    relationFields.map((field) => {
      const { relatedEntity } = field.properties as LookupResolvedProperties;
      const relatedEntitySelectComponent =
        entityToSelectComponent[relatedEntity.name];
      return importNames(
        [builders.identifier(relatedEntitySelectComponent.name)],
        relativeImportPath(modulePath, relatedEntitySelectComponent.modulePath)
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
    ...importContainedIdentifiers(file, IMPORTABLE_IDS),
  ]);

  return { name, file, modulePath };
}
