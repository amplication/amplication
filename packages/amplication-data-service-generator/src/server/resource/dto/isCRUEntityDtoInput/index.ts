import { EntityDtoTypeEnum } from "../entity-dto-type-enum";

export function isCRUEntityDtoInput(dtoType: EntityDtoTypeEnum): boolean {
  if (
    dtoType === EntityDtoTypeEnum.CreateInput ||
    dtoType === EntityDtoTypeEnum.UpdateInput ||
    dtoType === EntityDtoTypeEnum.WhereInput ||
    dtoType === EntityDtoTypeEnum.WhereUniqueInput
  ) {
    return true;
  }
  return false;
}
