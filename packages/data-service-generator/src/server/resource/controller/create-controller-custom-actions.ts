import { ModuleAction } from "@amplication/code-gen-types";
import { builders, namedTypes } from "ast-types";
import {
  createRestApiResponseTypeDecorator,
  createRestApiVerbDecorator,
  createStaticDecorators,
} from "./create-rest-api-decorator";
import { createPropTypeFromTypeDefList } from "../dto/custom-types/create-property-type";
import { PROMISE_ID } from "../../../utils/ast";

const SERVICE_ID = builders.identifier("service");

export function createControllerCustomActionMethods(
  actions: ModuleAction[]
): namedTypes.ClassMethod[] {
  if (!actions || actions.length === 0) {
    return [];
  }

  const methods = actions.map((action) => {
    return generateRestApiControllerMethod(action);
  });

  return methods;
}

function generateRestApiControllerMethod(
  action: ModuleAction
): namedTypes.ClassMethod {
  const method = generateControllerCustomActionMethod(action);

  method.decorators = [
    createRestApiVerbDecorator(action),
    createRestApiResponseTypeDecorator(action),
    ...createStaticDecorators(),
  ];

  return method;
}

export function generateControllerCustomActionMethod(
  action: ModuleAction
): namedTypes.ClassMethod {
  const inputType = createPropTypeFromTypeDefList([action.inputType]);
  const outputType = createPropTypeFromTypeDefList([action.outputType]);

  const inputParam = builders.identifier("args");
  inputParam.typeAnnotation = builders.tsTypeAnnotation(inputType);

  //generate this code within the function
  //return this.service.[name]](args);
  const method = builders.classMethod(
    "method",
    builders.identifier(action.name),
    [inputParam],
    builders.blockStatement([
      builders.returnStatement(
        builders.callExpression(
          builders.memberExpression(
            builders.memberExpression(builders.thisExpression(), SERVICE_ID),
            builders.identifier(action.name)
          ),
          [builders.identifier("args")]
        )
      ),
    ]),
    false,
    false
  );

  method.async = true;

  if (outputType) {
    const typeWithPromise = builders.tsTypeReference(
      PROMISE_ID,
      builders.tsTypeParameterInstantiation([outputType])
    );

    method.returnType = builders.tsTypeAnnotation(typeWithPromise);
  }

  return method;
}
