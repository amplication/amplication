import { namedTypes, builders } from "ast-types";
import { CreateApiPropertyDecorator } from ".";
import { EXAMPLE_SINGLE_LINE_TEXT_FIELD } from "../../../../server/resource/util/test-data";
import { ENUM, REQUIRED } from "../create-field-class-property";
import { API_PROPERTY } from "../nestjs-swagger.util";

describe("Testing the generation of the ApiProperty decorator", () => {
  let creator: CreateApiPropertyDecorator;
  beforeEach(() => {
    creator = new CreateApiPropertyDecorator(
      true,
      EXAMPLE_SINGLE_LINE_TEXT_FIELD
    );
  });
  describe("Testing the optional option", () => {
    const getScopeDecorator = (optional: boolean) => {
      const decorator = creator.optional(optional).build();
      return {
        decorator,
      };
    };
    it("should have the name of ApiProperty", () => {
      const { decorator } = getScopeDecorator(true);
      expect(getDecoratorTitle(decorator)).toBe(API_PROPERTY);
    });
    it("should one property named required", () => {
      const { decorator } = getScopeDecorator(true);
      const requiredProperty = getDecoratorBody(decorator)[0]
        .properties[0] as namedTypes.ObjectProperty;
      expect((requiredProperty.key as namedTypes.Identifier).name).toBe(
        REQUIRED
      );
    });
    it("should have only one option", () => {
      const { decorator } = getScopeDecorator(true);
      expect(getDecoratorBody(decorator).length).toBe(1);
    });
    it("should be require:false", () => {
      const decorator = creator.optional(true).build();
      const decoratorBody = getDecoratorBody(decorator);
      const requiredProperty = (decoratorBody[0] as namedTypes.ObjectExpression)
        .properties[0] as namedTypes.ObjectProperty;
      expect((requiredProperty.value as namedTypes.BooleanLiteral).value).toBe(
        false
      );
    });
    it("should be require:true", () => {
      const { decorator } = getScopeDecorator(false);

      const requiredProperty = (getDecoratorBody(
        decorator
      )[0] as namedTypes.ObjectExpression)
        .properties[0] as namedTypes.ObjectProperty;
      expect((requiredProperty.value as namedTypes.BooleanLiteral).value).toBe(
        true
      );
    });
  });
  describe("Testing the enum option", () => {
    const EXAMPLE_ENUM_NAME = "ExampleEnum";
    const EXAMPLE_ENUM_ID = builders.identifier(EXAMPLE_ENUM_NAME);

    const getScopeDecorator = () => {
      const decorator = creator.enum(EXAMPLE_ENUM_ID).build();
      return decorator;
    };
    it("should have a property called enum", () => {
      const decoratorBody = getDecoratorBody(getScopeDecorator());
      expect(
        (getObjectProperty(decoratorBody).key as namedTypes.Identifier).name
      ).toBe(ENUM);
    });
    it("should have the enum property have the value of the proper type", () => {
      const decoratorBody = getDecoratorBody(getScopeDecorator());
      const value = getObjectProperty(decoratorBody)
        .value as namedTypes.Identifier;
      expect(value.name).toBe(EXAMPLE_ENUM_NAME);
    });
  });
});

const getDecoratorTitle = (decorator: namedTypes.Decorator) => {
  return ((decorator.expression as namedTypes.CallExpression)
    .callee as namedTypes.Identifier).name;
};
const getDecoratorBody = (decorator: namedTypes.Decorator) => {
  return (decorator.expression as namedTypes.CallExpression)
    .arguments as namedTypes.ObjectExpression[];
};
const getObjectProperty = (decoratorBody: namedTypes.ObjectExpression[]) => {
  return (decoratorBody[0] as namedTypes.ObjectExpression)
    .properties[0] as namedTypes.ObjectProperty;
};
