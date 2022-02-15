import { EntityDtoTypeEnum } from "./entity-dto-type-enum";

export function isCRUDEntityDtoInput(dtoType: EntityDtoTypeEnum): boolean {
  if (
    dtoType ===
    (EntityDtoTypeEnum.CreateInput ||
      EntityDtoTypeEnum.UpdateInput ||
      EntityDtoTypeEnum.WhereInput ||
      EntityDtoTypeEnum.WhereUniqueInput)
  ) {
    return true;
  }
  return false;
}
