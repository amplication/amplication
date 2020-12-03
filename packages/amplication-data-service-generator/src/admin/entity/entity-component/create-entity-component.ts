import * as path from "path";
import { builders, namedTypes } from "ast-types";
import { ExpressionKind } from "ast-types/gen/kinds";
import { paramCase } from "param-case";
import { plural } from "pluralize";
import { Entity } from "../../../types";
import {
  addImports,
  getNamedProperties,
  importNames,
  interpolate,
  NamedClassProperty,
} from "../../../util/ast";
import { readFile, relativeImportPath } from "../../../util/module";
import { DTOs } from "../../../resource/create-dtos";
import { EntityComponent } from "../../types";
import { buildMessage } from "class-validator";

const template = path.resolve(__dirname, "entity-component.template.tsx");

const P_ID = builders.jsxIdentifier("p");
const LABEL_ID = builders.jsxIdentifier("label");
const TEXT_FIELD_ID = builders.jsxIdentifier("TextField");
const NAME_ID = builders.jsxIdentifier("name");
const SINGLE_SPACE_STRING_LITERAL = builders.stringLiteral(" ");

const DATA_ID = builders.identifier("data");

export async function createEntityComponent(
  entity: Entity,
  dtos: DTOs,
  entityToDirectory: Record<string, string>,
  dtoNameToPath: Record<string, string>
): Promise<EntityComponent> {
  const name = entity.name;
  const modulePath = `${entityToDirectory[entity.name]}/${name}.tsx`;
  const entityDTO = dtos[entity.name].entity;
  const dto = dtos[entity.name].updateInput;
  const dtoProperties = getNamedProperties(dto);
  const fieldsByName = Object.fromEntries(
    entity.fields.map((field) => [field.name, field])
  );
  const localEntityDTOId = builders.identifier(`T${entityDTO.id.name}`);
  const file = await readFile(template);
  interpolate(file, {
    COMPONENT_NAME: builders.identifier(name),
    ENTITY_NAME: builders.stringLiteral(entity.displayName),
    RESOURCE: builders.stringLiteral(paramCase(plural(entity.name))),
    ENTITY: localEntityDTOId,
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
                TEXT_FIELD_ID,
                [
                  builders.jsxAttribute(
                    NAME_ID,
                    builders.stringLiteral(property.key.name)
                  ),
                  builders.jsxAttribute(
                    builders.jsxIdentifier("defaultValue"),
                    builders.jsxExpressionContainer(
                      createDefaultValue(property)
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
  });

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
  ]);

  return { name, file, modulePath };
}

/** @todo implement cases */
function createDefaultValue(
  property: NamedClassProperty
): namedTypes.MemberExpression | namedTypes.TSAsExpression {
  const value = builders.memberExpression(
    DATA_ID,
    builders.identifier(property.key.name)
  );
  /** @todo do not use any */
  return asAny(value);
}

function asAny(expression: ExpressionKind): namedTypes.TSAsExpression {
  return builders.tsAsExpression(expression, builders.tsAnyKeyword());
}
