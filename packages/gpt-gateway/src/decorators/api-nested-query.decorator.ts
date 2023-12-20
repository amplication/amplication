import { applyDecorators } from "@nestjs/common";
import {
  ApiExtraModels,
  ApiQuery,
  ApiQueryOptions,
  getSchemaPath,
} from "@nestjs/swagger";
import "reflect-metadata";

const generateApiQueryObject = (
  prop: any,
  propType: any,
  required: boolean,
  isArray: boolean
): ApiQueryOptions => {
  if (propType === Number) {
    return {
      required,
      name: prop,
      style: "deepObject",
      explode: true,
      type: "number",
      isArray,
    };
  } else if (propType === String) {
    return {
      required,
      name: prop,
      style: "deepObject",
      explode: true,
      type: "string",
      isArray,
    };
  } else {
    return {
      required,
      name: prop,
      style: "deepObject",
      explode: true,
      type: "object",
      isArray,
      schema: {
        $ref: getSchemaPath(propType),
      },
    };
  }
};

// eslint-disable-next-line @typescript-eslint/ban-types,@typescript-eslint/explicit-module-boundary-types,@typescript-eslint/naming-convention
export function ApiNestedQuery(query: Function) {
  const constructor = query.prototype;
  const properties = Reflect.getMetadata(
    "swagger/apiModelPropertiesArray",
    constructor
  ).map((prop: any) => prop.slice(1));

  const decorators = properties
    .map((property: any) => {
      const { required, isArray } = Reflect.getMetadata(
        "swagger/apiModelProperties",
        constructor,
        property
      );
      const propertyType = Reflect.getMetadata(
        "design:type",
        constructor,
        property
      );
      const typedQuery = generateApiQueryObject(
        property,
        propertyType,
        required,
        isArray
      );
      return [ApiExtraModels(propertyType), ApiQuery(typedQuery)];
    })
    .flat();

  return applyDecorators(...decorators);
}
