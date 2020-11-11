import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { Entity } from "../../types";
import {
  interpolate,
  removeTSInterfaceDeclares,
  removeTSVariableDeclares,
} from "../../util/ast";
import { Module, readFile } from "../../util/module";
import { paramCase } from "param-case";
import { plural } from "pluralize";

const entityListTemplate = path.resolve(__dirname, "entity-list.template.tsx");

export async function createEntity(entity: Entity): Promise<Module> {
  const file = await readFile(entityListTemplate);
  const listComponentName = `${entity.name}List`;
  interpolate(file, {
    ENTITY_LIST: builders.identifier(listComponentName),
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
  return {
    path: `admin/src/${listComponentName}.tsx`,
    code: print(file).code,
  };
}
