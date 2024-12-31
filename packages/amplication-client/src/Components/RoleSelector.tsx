import {
  EnumButtonStyle,
  EnumIconPosition,
  SelectPanel,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import useRoles from "../Roles/hooks/useRoles";

type Props = {
  onChange: (selectedValues: string[]) => void;
  selectedValues: string[];
  buttonStyle?: EnumButtonStyle;
  label?: string;
  filterSelectedValues?: boolean;
};

const RoleSelector = ({
  onChange,
  selectedValues,
  buttonStyle = EnumButtonStyle.Text,
  label = "Add Roles",
  filterSelectedValues,
}: Props) => {
  const { findRolesData } = useRoles();

  const options = useMemo(() => {
    let availableRoles = findRolesData?.roles;

    if (filterSelectedValues) {
      availableRoles = availableRoles?.filter(
        (role) => !selectedValues.includes(role.id)
      );
    }

    return (
      availableRoles
        ?.map((role) => ({
          value: role.id,
          label: role.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)) || []
    );
  }, [filterSelectedValues, findRolesData?.roles, selectedValues]);

  return (
    <SelectPanel
      showSelectedItemsInButton={false}
      selectedValue={selectedValues || []}
      isMulti={true}
      onChange={onChange}
      options={options}
      label={label}
      openButtonProps={{
        icon: "chevron_up",
      }}
      buttonProps={{
        buttonStyle: buttonStyle,
        icon: "chevron_down",
        iconPosition: EnumIconPosition.Right,
      }}
    />
  );
};

export default RoleSelector;
