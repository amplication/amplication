import {
  DataGridFilter,
  DataGridRenderFilterProps,
  OptionItem,
} from "@amplication/ui/design-system";
import { useEffect, useMemo } from "react";
import useTeams from "../Teams/hooks/useTeams";

export const OwnerFilter = ({
  selectedValue,
  label,
  onChange,
  onRemove,
  columnKey,
  disabled,
}: DataGridRenderFilterProps) => {
  const { findTeamsData, getAvailableWorkspaceUsers, availableWorkspaceUsers } =
    useTeams();

  useEffect(() => {
    getAvailableWorkspaceUsers();
  }, []);

  const options = useMemo(() => {
    const teams =
      findTeamsData?.teams.map(
        (team): OptionItem => ({
          value: `teamId:${team.id}`,
          label: team.name,
          color: team.color,
          group: "Teams",
        })
      ) || [];

    const users = availableWorkspaceUsers.map(
      (user): OptionItem => ({
        value: `userId:${user.id}`,
        label: user.account.email,
        group: "Users",
      })
    );

    return [...teams, ...users];
  }, [availableWorkspaceUsers, findTeamsData?.teams]);

  return (
    //@todo: replace the build in list with formatted and grouped list of users and teams - we can expose a new property to override the default list component
    <DataGridFilter
      filterKey={columnKey}
      filterLabel={label}
      options={options}
      selectedValue={selectedValue}
      onChange={onChange}
      onRemove={onRemove}
      disabled={disabled}
      isMulti={false}
    />
  );
};
