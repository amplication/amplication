import React, { useCallback } from "react";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { EnumDataType } from "../entityFieldProperties/EnumDataType";
import * as types from "./types";

const FIELD_DATA_TYPE_TO_ICON: {
  [key in EnumDataType]: string;
} = {
  [EnumDataType.singleLineText]: "filter_3",
  [EnumDataType.multiLineText]: "filter_3",
  [EnumDataType.email]: "filter_3",
  [EnumDataType.state]: "filter_3",
  [EnumDataType.autoNumber]: "filter_3",
  [EnumDataType.wholeNumber]: "filter_3",
  [EnumDataType.dateTime]: "filter_3",
  [EnumDataType.decimalNumber]: "filter_3",
  [EnumDataType.file]: "filter_3",
  [EnumDataType.image]: "filter_3",
  [EnumDataType.lookup]: "filter_3",
  [EnumDataType.multiSelectOptionSet]: "filter_3",
  [EnumDataType.optionSet]: "filter_3",
  [EnumDataType.twoOptions]: "filter_3",
  [EnumDataType.boolean]: "filter_3",
  [EnumDataType.uniqueId]: "filter_3",
  [EnumDataType.geographicAddress]: "filter_3",
};

type Props = {
  field: types.EntityField;
  onClick: (entityField: types.EntityField) => void;
};

const EntityFieldListitem = ({ field, onClick }: Props) => {
  const handleClick = useCallback(() => {
    onClick(field);
  }, [onClick, field]);
  return (
    <Button
      key={field.id}
      outlined
      icon={FIELD_DATA_TYPE_TO_ICON[field.dataType]}
      onClick={handleClick}
    >
      {field.name}
    </Button>
  );
};

export default EntityFieldListitem;
