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

const P_ID = builders.jsxIdentifier("p");
const LABEL_ID = builders.jsxIdentifier("label");
const INPUT_ID = builders.jsxIdentifier("input");
const NAME_ID = builders.jsxIdentifier("name");
const ELEMENTS_ID = builders.identifier("elements");
const VALUE_ID = builders.identifier("value");
const HTML_INPUT_ELEMENT_ID = builders.identifier("HTMLInputElement");
const FORM_ELEMENTS_ID = builders.identifier("FormElements");
const SINGLE_SPACE_STRING_LITERAL = builders.stringLiteral(" ");

export async function createCreateEntityModule(
  entity: Entity
): Promise<Module> {
  const file = await readFile(entityListTemplate);
  const createComponentName = `Create${entity.name}`;
  interpolate(file, {
    CREATE_ENTITY: builders.identifier(createComponentName),
    ENTITY_NAME: builders.stringLiteral(entity.displayName),
    RESOURCE: builders.stringLiteral(paramCase(plural(entity.name))),
    INPUTS: builders.jsxFragment(
      builders.jsxOpeningFragment(),
      builders.jsxClosingFragment(),
      entity.fields.map((field) =>
        builders.jsxElement(
          builders.jsxOpeningElement(P_ID),
          builders.jsxClosingElement(P_ID),
          [
            builders.jsxElement(
              builders.jsxOpeningElement(LABEL_ID),
              builders.jsxClosingElement(LABEL_ID),
              [builders.jsxText(field.displayName)]
            ),
            builders.jsxExpressionContainer(SINGLE_SPACE_STRING_LITERAL),
            builders.jsxElement(
              builders.jsxOpeningElement(
                INPUT_ID,
                [
                  builders.jsxAttribute(
                    NAME_ID,
                    builders.stringLiteral(field.name)
                  ),
                ],
                true
              )
            ),
          ]
        )
      )
    ),
    ELEMENTS_MAPPING: builders.objectExpression(
      entity.fields.map((field) =>
        builders.objectProperty(
          builders.identifier(field.name),
          builders.memberExpression(
            builders.memberExpression(
              ELEMENTS_ID,
              builders.identifier(field.name)
            ),
            VALUE_ID
          )
        )
      )
    ),
  });
  file.program.body.splice(
    -1,
    0,
    builders.tsInterfaceDeclaration(
      FORM_ELEMENTS_ID,
      builders.tsInterfaceBody(
        entity.fields.map((field) =>
          builders.tsPropertySignature(
            builders.identifier(field.name),
            builders.tsTypeAnnotation(
              builders.tsTypeReference(HTML_INPUT_ELEMENT_ID)
            )
          )
        )
      )
    )
  );
  removeTSVariableDeclares(file);
  removeTSInterfaceDeclares(file);
  removeTSIgnoreComments(file);
  return {
    path: `admin/src/${createComponentName}.tsx`,
    code: print(file).code,
  };
}
