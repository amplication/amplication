import * as path from "path";
import { builders, namedTypes } from "ast-types";
import { ExpressionKind } from "ast-types/gen/kinds";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity } from "../../../types";
import { interpolate } from "../../../util/ast";
import { readFile } from "../../../util/module";
import { DTOs } from "../../../resource/create-dtos";
import { EntityComponent } from "../../types";

const entityListTemplate = path.resolve(__dirname, "entity-list.template.tsx");

const TD_ID = builders.jsxIdentifier("td");
const JSON_ID = builders.identifier("JSON");
const STRINGIFY_ID = builders.identifier("stringify");
const ITEM_ID = builders.identifier("item");

export async function createEntityListComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>
): Promise<EntityComponent> {
  const file = await readFile(entityListTemplate);
  const name = `${entity.name}List`;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;
  const nonIdFields = entity.fields.filter((field) => field.name !== "id");
  interpolate(file, {
    ENTITY: builders.identifier(entity.name),
    ENTITY_LIST: builders.identifier(name),
    ENTITY_PLURAL_DISPLAY_NAME: builders.stringLiteral(
      entity.pluralDisplayName
    ),
    RESOURCE: builders.stringLiteral(paramCase(plural(entity.name))),
    TITLE_CELLS: builders.jsxFragment(
      builders.jsxOpeningFragment(),
      builders.jsxClosingFragment(),
      nonIdFields.map((field) =>
        builders.jsxElement(
          builders.jsxOpeningElement(builders.jsxIdentifier("th")),
          builders.jsxClosingElement(builders.jsxIdentifier("th")),
          [builders.jsxText(field.name)]
        )
      )
    ),
    CELLS: builders.jsxFragment(
      builders.jsxOpeningFragment(),
      builders.jsxClosingFragment(),
      nonIdFields.map((field) =>
        builders.jsxElement(
          builders.jsxOpeningElement(TD_ID),
          builders.jsxClosingElement(TD_ID),
          [
            builders.jsxExpressionContainer(
              createJSONStringifyCallExpression([
                builders.memberExpression(
                  ITEM_ID,
                  builders.identifier(field.name)
                ),
              ])
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

function createJSONStringifyCallExpression(
  args: ExpressionKind[]
): namedTypes.CallExpression {
  return builders.callExpression(
    builders.memberExpression(JSON_ID, STRINGIFY_ID),
    args
  );
}
