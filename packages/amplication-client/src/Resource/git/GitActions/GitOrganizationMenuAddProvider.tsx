import React, { useCallback } from "react";
import * as models from "../../../models";
import { SelectMenuItem } from "@amplication/ui/design-system";
import { Icon } from "@amplication/ui/design-system";

export const GitOrganizationMenuAddProvider = ({
  provider,
  label,
  onAddGitOrganization,
  className,
}: {
  provider: models.EnumGitProvider;
  onAddGitOrganization: (provider: string) => void;
  label: string;
  className: string;
}) => {
  const itemSelected = useCallback(() => {
    onAddGitOrganization(provider);
  }, [provider]);

  return (
    <SelectMenuItem onSelectionChange={itemSelected}>
      <span>{label}</span>
      <Icon icon="plus" className={`${className}__add-icon`} size="xsmall" />
    </SelectMenuItem>
  );
};
