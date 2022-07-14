import { EntityField } from "@amplication/code-gen-types";
import { EnumDataType } from "../../../../../models";

const defaultJsonField: Omit<
  EntityField,
  "required" | "searchable" | "unique"
> = {
  dataType: EnumDataType.Json,
  displayName: "JsonFieldDisplayName",
  id: "id",
  name: "JsonFieldName",
  permanentId: "permanentId",
  description: "description",
};
Object.freeze(defaultJsonField);

export default defaultJsonField;
