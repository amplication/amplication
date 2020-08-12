import React, { useCallback } from "react";
import { ListItem, ListItemGraphic, ListItemText } from "@rmwc/list";
import "@rmwc/list/styles";
import * as models from "../models";
import { useRouteMatch } from "react-router-dom";
import "./EntityFieldListItem.scss";

const FIELD_DATA_TYPE_TO_ICON: {
  [key in models.EnumDataType]: string;
} = {
  [models.EnumDataType.SingleLineText]: "filter_3",
  [models.EnumDataType.MultiLineText]: "filter_3",
  [models.EnumDataType.Email]: "filter_3",
  [models.EnumDataType.State]: "filter_3",
  [models.EnumDataType.AutoNumber]: "filter_3",
  [models.EnumDataType.WholeNumber]: "filter_3",
  [models.EnumDataType.DateTime]: "filter_3",
  [models.EnumDataType.DecimalNumber]: "filter_3",
  [models.EnumDataType.File]: "filter_3",
  [models.EnumDataType.Image]: "filter_3",
  [models.EnumDataType.Lookup]: "filter_3",
  [models.EnumDataType.MultiSelectOptionSet]: "filter_3",
  [models.EnumDataType.OptionSet]: "filter_3",
  [models.EnumDataType.TwoOptions]: "filter_3",
  [models.EnumDataType.Boolean]: "filter_3",
  [models.EnumDataType.Id]: "filter_3",
  [models.EnumDataType.CreatedAt]: "filter_3",
  [models.EnumDataType.UpdatedAt]: "filter_3",
  [models.EnumDataType.GeographicAddress]: "filter_3",
};

type Props = {
  entity: models.Entity;
  field: models.EntityField;
  onClick: (entityField: models.EntityField) => void;
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
