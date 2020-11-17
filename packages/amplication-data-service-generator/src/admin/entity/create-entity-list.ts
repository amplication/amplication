import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity } from "../../types";
import {
  interpolate,
  removeTSIgnoreComments,
  removeTSInterfaceDeclares,
  removeTSVariableDeclares,
} from "../../util/ast";
import { Module, readFile } from "../../util/module";
import { DTOs } from "../../resource/create-dtos";

const entityListTemplate = path.resolve(__dirname, "entity-list.template.tsx");

export async function createEntityListModule(
  entity: Entity,
  entityToDirectory: Record<string, string>,
  dtos: DTOs
): Promise<Module> {
  const file = await readFile(entityListTemplate);
  const componentName = `${entity.name}List`;
  const modulePath = `${entityToDirectory[entity.name]}/${componentName}.tsx`;
  interpolate(file, {
    ENTITY: builders.identifier(entity.name),
    ENTITY_LIST: builders.identifier(componentName),
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
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);
  removeTSIgnoreComments(file);
  return {
    path: modulePath,
    code: print(file).code,
  };
}
