import { ModuleAction } from "@amplication/code-gen-types";
import { builders } from "ast-types";
import { namedTypes } from "ast-types/gen/namedTypes";
import { createTypeFromTypeDef } from "../dto/custom-types/create-type-decorator";

const API_OK_RESPONSE_ID = builders.identifier("swagger.ApiOkResponse");

/*
@Public()
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
