import { builders, namedTypes } from "ast-types";
import { EXAMPLE_LOOKUP_FIELD } from "../../../../server/resource/util/test-data";
import { Entity } from "../../../../types";
import { NamedClassDeclaration } from "../../../../util/ast";
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
  fields: [EXAMPLE_LOOKUP_FIELD],
  permissions: [],
};

describe("Testing the generation of the nested input dtos", () => {
  const classId = builders.identifier("ClassId");
  describe("Testing the RelationUpdateManyWithoutSourceInput dto", () => {
    let dtoClass: NamedClassDeclaration;
    beforeEach(() => {
      dtoClass = createNestedInputDTO(
        classId,
        EXAMPLE_ENTITY,
        EXAMPLE_LOOKUP_FIELD,
        EntityDtoTypeEnum.RelationUpdateManyWithoutSourceInput
      );
    });
    it("should have connect property as the first one", () => {
      expect(
        ((dtoClass.body.body[0] as namedTypes.ClassProperty)
          .key as namedTypes.Identifier).name
      ).toBe(NestedMutationOptions.Connect);
    });
    it("should have disconnect property as the second one", () => {
      expect(
        ((dtoClass.body.body[1] as namedTypes.ClassProperty)
          .key as namedTypes.Identifier).name
      ).toBe(NestedMutationOptions.Disconnect);
    });
    it("should have set property as the third one", () => {
      expect(
        ((dtoClass.body.body[2] as namedTypes.ClassProperty)
          .key as namedTypes.Identifier).name
      ).toBe(NestedMutationOptions.Set);
    });
  });
});
