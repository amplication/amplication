import React from "react";
import {
  EnumTextColor,
  EnumTextStyle,
  Icon,
  Text,
} from "@amplication/ui/design-system";
import "./EntityFieldProperty.scss";

const CLASS_NAME = "entity-field-list-item-property";

export const EntityFieldProperty: React.FC<{
  icon: string;
  property: string;
}> = ({ property, icon }) => {
  return (
    <span className={`${CLASS_NAME}__container`}>
      <Icon icon={icon} size="xsmall" />
      <Text textColor={EnumTextColor.White} textStyle={EnumTextStyle.Tag}>
        {property}
      </Text>
    </span>
  );
};
