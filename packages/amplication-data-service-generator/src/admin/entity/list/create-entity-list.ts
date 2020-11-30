import * as path from "path";
import { builders, namedTypes } from "ast-types";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity } from "../../../types";
import { interpolate } from "../../../util/ast";
import { readFile } from "../../../util/module";
import { DTOs } from "../../../resource/create-dtos";
import { EntityComponent } from "../../types";

const entityListTemplate = path.resolve(__dirname, "entity-list.template.tsx");

export async function createEntityListComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>
): Promise<EntityComponent> {
  const file = await readFile(entityListTemplate);
  const name = `${entity.name}List`;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;
  interpolate(file, {
    ENTITY: builders.identifier(entity.name),
    ENTITY_LIST: builders.identifier(name),
    ENTITY_PLURAL_DISPLAY_NAME: builders.stringLiteral(
      entity.pluralDisplayName
    ),
    RESOURCE: builders.stringLiteral(paramCase(plural(entity.name))),
    CELLS: builders.jsxFragment(
      builders.jsxOpeningFragment(),
      builders.jsxClosingFragment(),
      entity.fields.map((field) =>
        builders.jsxElement(
          builders.jsxOpeningElement(builders.jsxIdentifier("td")),
          builders.jsxClosingElement(builders.jsxIdentifier("td")),
          [
            builders.jsxExpressionContainer(
              builders.callExpression(
                builders.memberExpression(
                  builders.identifier("JSON"),
                  builders.identifier("stringify")
                ),
                [
                  builders.memberExpression(
                    builders.identifier("item"),
                    builders.identifier(field.name)
                  ),
                ]
              )
            ),
          ]
        )
      )
    ),
    ENTITY_TYPE: builders.tsTypeLiteral(
      entity.fields.map((field) =>
        builders.tsPropertySignature(
          builders.identifier(field.name),
          builders.tsTypeAnnotation(builders.tsAnyKeyword())
        )
      )
    ),
  });
  return { name, file, modulePath };
}
