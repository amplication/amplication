import React, { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import * as models from "../models";
import { ActionRole } from "./ActionRole";

type Props = {
  availableRoles: models.ResourceRole[];
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
  const [selectedRoleList, setSelectedRoleList] =
    useState<Set<string>>(selectedRoleIds);

  // onChange is wrapped with a useDebouncedCallback so it won't be called more often than defined in debounceMs
  // This function is called by handleRoleSelect as it can not manage dependencies
  const [debouncedOnChange] = useDebouncedCallback((value: Set<string>) => {
    onChange(value);
  }, debounceMS);

  const handleRoleSelect = useCallback(
    ({ id }: models.ResourceRole, checked: boolean) => {
      const newSet = new Set(selectedRoleList);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      setSelectedRoleList(newSet);
      debouncedOnChange(newSet);
    },
    [setSelectedRoleList, selectedRoleList, debouncedOnChange]
  );

  return (
    <>
      {availableRoles.map((role) => (
        <ActionRole
          key={role.id}
          role={role}
          onClick={handleRoleSelect}
          selected={selectedRoleList.has(role.id)}
        />
      ))}
    </>
  );
};
