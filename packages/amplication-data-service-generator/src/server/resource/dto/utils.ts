import { EntityDtoType, entityDtoTypeEnum } from "./entity-dto-type-enum";

export function isCRUDEntityDtoInput(dtoType: EntityDtoType): boolean {
  if (
    dtoType ===
    (entityDtoTypeEnum.CreateInput ||
      entityDtoTypeEnum.UpdateInput ||
      entityDtoTypeEnum.WhereInput ||
      entityDtoTypeEnum.WhereUniqueInput)
  ) {
    return true;
  }
  return false;
}
