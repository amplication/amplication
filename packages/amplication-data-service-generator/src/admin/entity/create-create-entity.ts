import * as path from "path";
import { print } from "recast";
import { builders, namedTypes } from "ast-types";
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
  entity: Entity,
  entityToDirectory: Record<string, string>,
  dtos: DTOs
): Promise<Module> {
  const file = await readFile(entityListTemplate);
  const componentName = `Create${entity.name}`;
  const modulePath = `${entityToDirectory[entity.name]}/${componentName}.tsx`;
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
  interpolate(file, {
    COMPONENT_NAME: builders.identifier(componentName),
    ENTITY_NAME: builders.stringLiteral(entity.displayName),
    RESOURCE: builders.stringLiteral(paramCase(plural(entity.name))),
    INPUTS: builders.jsxFragment(
      builders.jsxOpeningFragment(),
      builders.jsxClosingFragment(),
      dtoProperties.map((property) => {
        const field = fieldsByName[property.key.name];
        return builders.jsxElement(
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
                    builders.stringLiteral(property.key.name)
                  ),
                ],
                true
              )
            ),
          ]
        );
      })
    ),
    ELEMENTS_MAPPING: builders.objectExpression(
      dtoProperties.map((property) =>
        builders.objectProperty(
          builders.identifier(property.key.name),
          builders.memberExpression(
            builders.memberExpression(
              ELEMENTS_ID,
              builders.identifier(property.key.name)
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
    path: modulePath,
    code: print(file).code,
  };
}
