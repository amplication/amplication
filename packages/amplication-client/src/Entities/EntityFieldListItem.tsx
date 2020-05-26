import React, { useCallback } from "react";
import { Button } from "@rmwc/button";
import "@rmwc/button/styles";
import { EntityField, EntityFieldDataType } from "./types";

const FIELD_DATA_TYPE_TO_ICON: { [key in EntityFieldDataType]: string } = {
  [EntityFieldDataType.singleLineText]: "filter_3",
  [EntityFieldDataType.multiLineText]: "filter_3",
  [EntityFieldDataType.email]: "filter_3",
  [EntityFieldDataType.numbers]: "filter_3",
  [EntityFieldDataType.autoNumber]: "filter_3",
};

type Props = {
  field: EntityField;
  onClick: (entityField: EntityField) => void;
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
