import React, { useCallback } from "react";
import { ListItem, ListItemGraphic, ListItemText } from "@rmwc/list";
import "@rmwc/list/styles";
import { EnumDataType } from "../entityFieldProperties/EnumDataType";
import * as types from "./types";
import { useRouteMatch } from "react-router-dom";
import "./EntityFieldListItem.scss";

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
  entity: types.Entity;
  field: types.EntityField;
  onClick: (entityField: types.EntityField) => void;
};

const EntityFieldListitem = ({ entity, field, onClick }: Props) => {
  const fieldRouteMatch = useRouteMatch<{ entity: string; field: string }>(
    "/:application/entities/:entity/fields/:field"
  );
  const handleClick = useCallback(() => {
    onClick(field);
  }, [onClick, field]);
  const icon = FIELD_DATA_TYPE_TO_ICON[field.dataType];
  const active = fieldRouteMatch
    ? fieldRouteMatch.params.entity === entity.id &&
      fieldRouteMatch.params.field === field.id
    : false;
  return (
    <ListItem
      className="entity-field-list-item"
      key={field.id}
      activated={active}
      onClick={handleClick}
    >
      <ListItemGraphic icon={icon} />
      <ListItemText>{field.displayName}</ListItemText>
    </ListItem>
  );
};

export default EntityFieldListitem;
