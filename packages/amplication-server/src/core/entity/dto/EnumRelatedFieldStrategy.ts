import { registerEnumType } from "@nestjs/graphql";

export enum EnumRelatedFieldStrategy {
  Delete = "Delete",
  UpdateToScalar = "UpdateToScalar",
}
registerEnumType(EnumRelatedFieldStrategy, {
  name: "EnumRelatedFieldStrategy",
});
