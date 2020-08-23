import React, { useCallback, useMemo } from "react";
import * as models from "../models";

import { Button, EnumButtonStyle } from "../Components/Button";
import { Panel, EnumPanelStyle } from "../Components/Panel";

const CLASS_NAME = "entity-permission-fields";

type TData = {
  entity: models.Entity;
};

type Props = {
  actionDisplayName: string;
  field: models.EntityField;
  onDeleteField: (fieldName: string) => void;
};

export const EntityPermissionField = ({
  actionDisplayName,
  field,
  onDeleteField,
}: Props) => {
  const handleDeleteField = useCallback(() => {
    onDeleteField(field.name);
  }, [onDeleteField, field]);

  return (
    <Panel
      panelStyle={EnumPanelStyle.Bordered}
      className={`${CLASS_NAME}__field`}
    >
      <div className={`${CLASS_NAME}__header`}>
        <span>
          <span className={`${CLASS_NAME}__action-name`}>
            {actionDisplayName}
          </span>{" "}
          {field.name}
        </span>
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          icon="delete_outline"
          onClick={handleDeleteField}
        />
      </div>
    </Panel>
  );
};
