import { registerEnumType } from "@nestjs/graphql";

export enum EnumCustomPropertyType {
  Text = "Text",
  Link = "Link",
  Select = "Select",
  MultiSelect = "MultiSelect",
}

registerEnumType(EnumCustomPropertyType, { name: "EnumCustomPropertyType" });
