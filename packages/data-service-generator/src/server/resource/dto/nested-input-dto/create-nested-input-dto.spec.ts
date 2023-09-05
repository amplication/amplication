import { builders, namedTypes } from "ast-types";
import { EXAMPLE_LOOKUP_FIELD } from "../../util/test-data";
import { Entity, NamedClassDeclaration } from "@amplication/code-gen-types";
import { EntityDtoTypeEnum } from "../entity-dto-type-enum";
import {
  createNestedInputDTO,
  NestedMutationOptions,
} from "./create-nested-input-dto";

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "EXAMPLE_ENTITY_NAME",
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  pluralName: "ExampleEntities",
  fields: [EXAMPLE_LOOKUP_FIELD],
  permissions: [],
};

const checkProperty = (
  dtoClass: NamedClassDeclaration,
  propertyPosition: number,
  expectedNestedMutationOptions: NestedMutationOptions
) => {
  expect(
    (
      (dtoClass.body.body[propertyPosition] as namedTypes.ClassProperty)
        .key as namedTypes.Identifier
    ).name
  ).toBe(expectedNestedMutationOptions);
};

describe("Testing the generation of the nested input dtos", () => {
  const classId = builders.identifier("ClassId");
  let dtoClass: NamedClassDeclaration;

  describe("Testing the RelationCreateNestedManyWithoutSourceInput dto", () => {
    beforeEach(() => {
      dtoClass = createNestedInputDTO(
        classId,
        EXAMPLE_ENTITY,
        EXAMPLE_LOOKUP_FIELD,
        EntityDtoTypeEnum.RelationCreateNestedManyWithoutSourceInput
      );
    });
    it("should have connect property as the first one", () => {
      checkProperty(dtoClass, 0, NestedMutationOptions.Connect);
    });
    it("should have no second property", () => {
      expect(dtoClass.body.body[1]).toBeUndefined();
    });
  });
  describe("Testing the RelationUpdateManyWithoutSourceInput dto", () => {
    beforeEach(() => {
      dtoClass = createNestedInputDTO(
        classId,
        EXAMPLE_ENTITY,
        EXAMPLE_LOOKUP_FIELD,
        EntityDtoTypeEnum.RelationUpdateManyWithoutSourceInput
      );
    });
    it("should have connect property as the first one", () => {
      checkProperty(dtoClass, 0, NestedMutationOptions.Connect);
    });
    it("should have disconnect property as the second one", () => {
      checkProperty(dtoClass, 1, NestedMutationOptions.Disconnect);
    });
    it("should have set property as the third one", () => {
      checkProperty(dtoClass, 2, NestedMutationOptions.Set);
    });
    it("should have only 3 properties", () => {
      expect(dtoClass.body.body[3]).toBeUndefined();
    });
  });
});
