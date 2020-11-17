import * as path from "path";
import { print } from "recast";
import { builders } from "ast-types";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { camelCase } from "camel-case";
import { Entity } from "../../types";
import {
  addImports,
  getNamedProperties,
  importNames,
  interpolate,
  removeTSIgnoreComments,
  removeTSInterfaceDeclares,
  removeTSVariableDeclares,
} from "../../util/ast";
import { Module, readFile, relativeImportPath } from "../../util/module";
import { DTOs } from "../../resource/create-dtos";
import { createDTOModulePath } from "../../resource/dto/create-dto-module";

const entityListTemplate = path.resolve(
  __dirname,
  "update-entity.template.tsx"
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

export async function createUpdateEntityModule(
  entity: Entity,
  entityToDirectory: Record<string, string>,
  dtos: DTOs,
  dtoNameToPath: Record<string, string>
): Promise<Module> {
  const componentName = `Update${entity.name}`;
  const modulePath = `${entityToDirectory[entity.name]}/${componentName}.tsx`;
  const entityDTO = dtos[entity.name].entity;
  const dto = dtos[entity.name].updateInput;
  const dtoProperties = getNamedProperties(dto);
  const fieldsByName = Object.fromEntries(
    entity.fields.map((field) => [field.name, field])
  );
  const file = await readFile(entityListTemplate);
  interpolate(file, {
    COMPONENT_NAME: builders.identifier(componentName),
    ENTITY_NAME: builders.stringLiteral(entity.displayName),
    RESOURCE: builders.stringLiteral(paramCase(plural(entity.name))),
    ENTITY: entityDTO.id,
    UPDATE_INPUT: dto.id,
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
                  builders.jsxAttribute(
                    builders.jsxIdentifier("value"),
                    builders.jsxExpressionContainer(
                      builders.memberExpression(
                        builders.identifier("data"),
                        builders.identifier(property.key.name)
                      )
                    )
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

  return {
    path: modulePath,
    code: print(file).code,
  };
}
