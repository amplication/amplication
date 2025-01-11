import {
  ModuleAction,
  ModuleDto,
  PropertyTypeDef,
  EnumModuleActionRestInputSource,
} from "@amplication/code-gen-types";
import { builders, namedTypes } from "ast-types";
import {
  createRestApiResponseTypeDecorator,
  createRestApiVerbDecorator,
  createStaticDecorators,
} from "./create-rest-api-decorator";
import { createPropTypeFromTypeDefList } from "../dto/custom-types/create-property-type";
import { PROMISE_ID, blockStatement } from "../../../utils/ast";
import {
  createControllerParamDecorator,
  createControllerBodyDecorator,
  createControllerQueryDecorator,
} from "../../../utils/create-controller-parameter-decorators";

const PARAMS_PROPERTY_NAME = "params";
const QUERY_PROPERTY_NAME = "query";
const BODY_PROPERTY_NAME = "body";

const INPUT_PROPERTY_TYPE_TO_ID_AND_DECORATOR: Record<
  Exclude<keyof typeof EnumModuleActionRestInputSource, "Split">,
  {
    getId: () => namedTypes.Identifier;
    getDecorator: () => namedTypes.Decorator;
  }
> = {
  Query: {
    getId: () => builders.identifier(QUERY_PROPERTY_NAME),
    getDecorator: () => createControllerQueryDecorator(),
  },
  Params: {
    getId: () => builders.identifier(PARAMS_PROPERTY_NAME),
    getDecorator: () => createControllerParamDecorator(),
  },
  Body: {
    getId: () => builders.identifier(BODY_PROPERTY_NAME),
    getDecorator: () => createControllerBodyDecorator(),
  },
};

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
  const outputType = createPropTypeFromTypeDefList([action.outputType]);

  const inputParams = prepareInputParameters(action);

  //generate this code within the function
  //return this.service.[name]](args);
  const method = builders.classMethod(
    "method",
    builders.identifier(action.name),
    inputParams.filter((param) => param !== null),
    prepareActionBody(action),
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

function prepareInputParameters(action: ModuleAction): namedTypes.Identifier[] {
  const inputParams: namedTypes.Identifier[] = [];

  if (action.restInputSource === EnumModuleActionRestInputSource.Split) {
    inputParams.push(
      prepareInputParameterSplit(
        EnumModuleActionRestInputSource.Params,
        action.inputType.dto,
        action.restInputParamsPropertyName,
        action
      )
    );

    inputParams.push(
      prepareInputParameterSplit(
        EnumModuleActionRestInputSource.Query,
        action.inputType.dto,
        action.restInputQueryPropertyName,
        action
      )
    );

    inputParams.push(
      prepareInputParameterSplit(
        EnumModuleActionRestInputSource.Body,
        action.inputType.dto,
        action.restInputBodyPropertyName,
        action
      )
    );
  } else {
    inputParams.push(
      prepareInputParameter(action.restInputSource, [action.inputType])
    );
  }

  return inputParams.filter((param) => param !== null);
}

function prepareInputParameterSplit(
  inputPropertyType: EnumModuleActionRestInputSource,
  inputDto: ModuleDto,
  propertyName: string,
  action: ModuleAction
): namedTypes.Identifier | null {
  if (!propertyName) {
    return null;
  }

  if (propertyName) {
    if (!inputDto) {
      throw new Error(
        `cannot create action '${action.name}' for controller. DTO not found, but propertyName for ${inputPropertyType} is defined. Check action input settings.`
      );
    }

    const property = action.inputType.dto?.properties.find((property) => {
      return property.name === propertyName;
    });

    if (!property) {
      throw new Error(
        `Cannot create action '${action.name}' for controller. Property '${propertyName}' not found in DTO '${inputDto.name}'. Check action input settings.`
      );
    }

    return prepareInputParameter(inputPropertyType, property.propertyTypes);
  }
}

function prepareInputParameter(
  inputPropertyType: keyof typeof EnumModuleActionRestInputSource,
  typeDefs: PropertyTypeDef[]
): namedTypes.Identifier | null {
  const parameterType = createPropTypeFromTypeDefList(typeDefs);
  const parameter =
    INPUT_PROPERTY_TYPE_TO_ID_AND_DECORATOR[inputPropertyType].getId();
  parameter.typeAnnotation = builders.tsTypeAnnotation(parameterType);
  const decorators = [
    INPUT_PROPERTY_TYPE_TO_ID_AND_DECORATOR[inputPropertyType].getDecorator(),
  ];
  //@ts-ignore - property is missing in ast-types
  parameter.decorators = decorators;
  return parameter;
}

//Generates the function body.
//The function return something like this, depends on the restInputSource value
// const args = {
//   prop1: params,
//   prop2: query,
//   prop3: body,
// };
// return this.service.promoteUser(args);
function prepareActionBody(action: ModuleAction): namedTypes.BlockStatement {
  const parts = [];

  if (action.restInputSource === "Split") {
    parts.push("const args = {");
    if (action.restInputParamsPropertyName) {
      parts.push(
        `${action.restInputParamsPropertyName}: ${PARAMS_PROPERTY_NAME},`
      );
    }
    if (action.restInputQueryPropertyName) {
      parts.push(
        `${action.restInputQueryPropertyName}: ${QUERY_PROPERTY_NAME},`
      );
    }
    if (action.restInputBodyPropertyName) {
      parts.push(`${action.restInputBodyPropertyName}: ${BODY_PROPERTY_NAME},`);
    }
    parts.push("};");
    parts.push(`return this.service.${action.name}(args);`);
  } else {
    const argsPropertyName =
      action.restInputSource === EnumModuleActionRestInputSource.Params
        ? PARAMS_PROPERTY_NAME
        : action.restInputSource === EnumModuleActionRestInputSource.Query
        ? QUERY_PROPERTY_NAME
        : BODY_PROPERTY_NAME;
    parts.push(`return this.service.${action.name}(${argsPropertyName});`);
  }

  return blockStatement(parts.join("\n"));
}
