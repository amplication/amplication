import { EnumDataType } from "../../../../../models";
import { EntityField } from "@amplication/code-gen-types";

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
