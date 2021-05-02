import { Icon } from "@rmwc/icon";
import classNames from "classnames";
import React from "react";
import { DATA_TYPE_TO_LABEL_AND_ICON } from "../Entity/constants";
import * as models from "../models";
import { CLASS_NAME } from "./EntitiesDiagram";

type Props = {
  field: models.AppCreateWithEntitiesFieldInput;
};

export const EntitiesDiagramStaticField = React.memo(({ field }: Props) => {
  const dataType = field.dataType || models.EnumDataType.SingleLineText;

  return (
    <div
      className={classNames(
        `${CLASS_NAME}__fields__field`,
        `${CLASS_NAME}__fields__field--static`
      )}
    >
      <Icon
        icon={{
          icon: DATA_TYPE_TO_LABEL_AND_ICON[dataType].icon,
          size: "xsmall",
        }}
      />
      <span>{field.name}</span>
      <span className="spacer" />
    </div>
  );
});
