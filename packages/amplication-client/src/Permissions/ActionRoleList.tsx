import React, { useCallback, useState, useRef } from "react";
import debounce from "lodash.debounce";

import * as models from "../models";
import { ActionRole } from "./ActionRole";

type Props = {
  availableRoles: models.AppRole[];
  selectedRoleIds: Set<string>;
  onChange: (selectedRoleIds: Set<string>) => void;
  debounceMS: number;
};

export const ActionRoleList = ({
  availableRoles,
  selectedRoleIds,
  debounceMS,
  onChange,
}: Props) => {
  const [selectedRoleList, setSelectedRoleList] = useState<Set<string>>(
    selectedRoleIds
  );

  const debouncedOnChange = useRef(
    debounce((value: Set<string>) => {
      onChange(value);
    }, debounceMS)
  );

  const handleRoleSelectionChange = useCallback(
    ({ id }: models.AppRole, checked: boolean) => {
      const newSet = new Set(selectedRoleList);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      setSelectedRoleList(newSet);
      debouncedOnChange.current(newSet);
    },
    [setSelectedRoleList, selectedRoleList]
  );

  return (
    <>
      {availableRoles.map((role) => (
        <ActionRole
          key={role.id}
          role={role}
          onClick={handleRoleSelectionChange}
          selected={selectedRoleList.has(role.id)}
        />
      ))}
    </>
  );
};
