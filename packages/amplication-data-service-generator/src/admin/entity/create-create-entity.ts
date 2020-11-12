import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { Entity } from "../../types";
import {
  interpolate,
  removeTSIgnoreComments,
  removeTSInterfaceDeclares,
  removeTSVariableDeclares,
} from "../../util/ast";
import { Module, readFile } from "../../util/module";
import { paramCase } from "param-case";
import { plural } from "pluralize";

const entityListTemplate = path.resolve(
  __dirname,
  "create-entity.template.tsx"
);

export async function createCreateEntityModule(
  entity: Entity
): Promise<Module> {
  const file = await readFile(entityListTemplate);
  const createComponentName = `Create${entity.name}`;
  interpolate(file, {
    ENTITY_NAME: builders.stringLiteral(entity.displayName),
    RESOURCE: builders.stringLiteral(paramCase(plural(entity.name))),
    INPUTS: builders.jsxFragment(
      builders.jsxOpeningFragment(),
      builders.jsxClosingFragment(),
      entity.fields.map((field) =>
        builders.jsxElement(
          builders.jsxOpeningElement(
            builders.jsxIdentifier("input"),
            [
              builders.jsxAttribute(
                builders.jsxIdentifier("name"),
                builders.stringLiteral(field.name)
              ),
            ],
            true
          )
        )
      )
    ),
    ELEMENTS_MAPPING: builders.objectExpression(
      entity.fields.map((field) =>
        builders.objectProperty(
          builders.identifier(field.name),
          builders.memberExpression(
            builders.memberExpression(
              builders.identifier("elements"),
              builders.identifier(field.name)
            ),
            builders.identifier("value")
          )
        )
      )
    ),
  });
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);
  removeTSIgnoreComments(file);
  return {
    path: `admin/src/${createComponentName}.tsx`,
    code: print(file).code,
  };
}
