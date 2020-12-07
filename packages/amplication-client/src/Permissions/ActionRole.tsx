import React, { useCallback } from "react";

import * as models from "../models";
import { ToggleButton } from "@amplication/design-system";

type Props = {
  role: models.AppRole;
  onClick: (role: models.AppRole, checked: boolean) => void;
  selected: boolean;
};

export const ActionRole = ({ role, onClick, selected }: Props) => {
  const handleClick = useCallback(
    (selected) => {
      onClick(role, selected);
    },
    [onClick, role]
  );

  return (
    <ToggleButton
      label={role.displayName}
      onClick={handleClick}
      selected={selected}
    />
  );
};
