import React from "react";
import { Icon } from "@amplication/design-system";
import "./EntityFieldProperty.scss";
type Props = {
  property: string;
  icon: string;
};

const CLASS_NAME = "entity-field-list-item-property";

export const EntityFieldProperty = ({ property, icon }: Props) => {
  return (
    <span className={`${CLASS_NAME}__container`}>
      <Icon icon={icon} size="xsmall" />
      {property}
    </span>
  );
};
