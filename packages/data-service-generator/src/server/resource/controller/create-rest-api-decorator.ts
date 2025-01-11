import {
  EnumModuleActionRestVerb,
  ModuleAction,
} from "@amplication/code-gen-types";
import { builders } from "ast-types";
import { namedTypes } from "ast-types/gen/namedTypes";
import { createTypeFromTypeDef } from "../dto/custom-types/create-type-decorator";

const API_OK_RESPONSE_ID = builders.identifier("swagger.ApiOkResponse");

const VERB_TO_DECORATOR: {
  [scalar in EnumModuleActionRestVerb]: namedTypes.Identifier;
} = {
  [EnumModuleActionRestVerb.Get]: builders.identifier("common.Get"),
  [EnumModuleActionRestVerb.Post]: builders.identifier("common.Post"),
  [EnumModuleActionRestVerb.Put]: builders.identifier("common.Put"),
  [EnumModuleActionRestVerb.Patch]: builders.identifier("common.Patch"),
  [EnumModuleActionRestVerb.Delete]: builders.identifier("common.Delete"),
  [EnumModuleActionRestVerb.Options]: builders.identifier("common.Options"),
  [EnumModuleActionRestVerb.Head]: builders.identifier("common.Head"),
  [EnumModuleActionRestVerb.Trace]: builders.identifier("common.Trace"),
};

/*
  @common.Get("/:id")
  @swagger.ApiOkResponse({ type: Post })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
*/
export function createRestApiResponseTypeDecorator(
  action: ModuleAction
): namedTypes.Decorator {
  const type = createTypeFromTypeDef(action.outputType);

  const obj = builders.objectExpression([
    builders.objectProperty(builders.identifier("type"), type),
  ]);

  return builders.decorator(builders.callExpression(API_OK_RESPONSE_ID, [obj]));
}

/*
  @common.Get("/:id")
*/
export function createRestApiVerbDecorator(
  action: ModuleAction
): namedTypes.Decorator {
  const verbId = VERB_TO_DECORATOR[action.restVerb];

  return builders.decorator(
    builders.callExpression(verbId, [builders.stringLiteral(action.path)])
  );
}

/*
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({
    type: errors.ForbiddenException,
  })
*/
export function createStaticDecorators(): namedTypes.Decorator[] {
  return [
    builders.decorator(
      builders.callExpression(
        builders.identifier("swagger.ApiNotFoundResponse"),
        [
          builders.objectExpression([
            builders.objectProperty(
              builders.identifier("type"),
              builders.identifier("errors.NotFoundException")
            ),
          ]),
        ]
      )
    ),
    builders.decorator(
      builders.callExpression(
        builders.identifier("swagger.ApiForbiddenResponse"),
        [
          builders.objectExpression([
            builders.objectProperty(
              builders.identifier("type"),
              builders.identifier("errors.ForbiddenException")
            ),
          ]),
        ]
      )
    ),
  ];
}
