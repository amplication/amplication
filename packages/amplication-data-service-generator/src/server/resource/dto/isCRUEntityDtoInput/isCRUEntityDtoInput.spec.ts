import { isCRUDEntityDtoInput } from ".";
import { EntityDtoTypeEnum } from "../entity-dto-type-enum";

describe("Testing the isCRUDEntityDtoInput function", () => {
  it("should false in entity dto", () => {
    expect(isCRUDEntityDtoInput(EntityDtoTypeEnum.Entity)).toBe(false);
  });
});
