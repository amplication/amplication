import React, { useCallback } from "react";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import * as types from "./types";

const FIELD_DATA_TYPE_TO_ICON: {
  [key in types.EntityFieldDataType]: string;
} = {
  [types.EntityFieldDataType.singleLineText]: "filter_3",
  [types.EntityFieldDataType.multiLineText]: "filter_3",
  [types.EntityFieldDataType.email]: "filter_3",
  [types.EntityFieldDataType.numbers]: "filter_3",
  [types.EntityFieldDataType.autoNumber]: "filter_3",
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
