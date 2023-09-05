import { builders, namedTypes } from "ast-types";
import {
  ENUM_ID,
  IS_ARRAY_ID,
  REQUIRED_ID,
  TRUE_LITERAL,
  TYPE_ID,
} from "../create-field-class-property";
import { API_PROPERTY_ID } from "../nestjs-swagger.util";

export class ApiPropertyDecoratorBuilder {
  private apiPropertyOptionsObjectExpression = builders.objectExpression([]);
  constructor(
    protected readonly isList: boolean,
    protected readonly isNestedInput: boolean
  ) {}
  optional(optional: boolean): this {
    this.apiPropertyOptionsObjectExpression.properties.push(
      builders.objectProperty(REQUIRED_ID, builders.booleanLiteral(!optional))
    );

    return this;
  }
  objectType(typeName: namedTypes.Identifier): this {
    this.apiPropertyOptionsObjectExpression.properties.push(
      builders.objectProperty(
        TYPE_ID,
        builders.arrowFunctionExpression(
          [],
          this.isList && !this.isNestedInput
            ? builders.arrayExpression([typeName])
            : typeName
        )
      )
    );
    return this;
  }
  scalarType(type: namedTypes.Identifier): this {
    const property = builders.objectProperty(
      TYPE_ID,
      this.isList ? builders.arrayExpression([type]) : type
    );
    this.apiPropertyOptionsObjectExpression.properties.push(property);
    return this;
  }

  enum(enumId: namedTypes.Identifier): this {
    const enumAPIProperty = builders.objectProperty(ENUM_ID, enumId);
    this.apiPropertyOptionsObjectExpression.properties.push(enumAPIProperty);
    this.isList &&
      this.apiPropertyOptionsObjectExpression.properties.push(
        builders.objectProperty(IS_ARRAY_ID, TRUE_LITERAL)
      );
    return this;
  }
  build(): namedTypes.Decorator {
    return builders.decorator(
      builders.callExpression(API_PROPERTY_ID, [
        this.apiPropertyOptionsObjectExpression,
      ])
    );
  }
}
