import {
  Button,
  CircularProgress,
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Icon,
  List,
  ListItem,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import React from "react";
import * as models from "../../models";
import { formatError } from "../../util/error";
import { pluralize } from "../../util/pluralize";
import AddTeamRole from "./AddTeamRoleButton";
import useTeams from "../hooks/useTeams";
import { useAppContext } from "../../context/appContext";

type Props = {
  team: models.Team;
  onRoleRemoved?: (team: models.Team) => void;
  onRoleAdded?: (team: models.Team) => void;
};

const TeamRoleList = React.memo(
  ({ team, onRoleRemoved, onRoleAdded }: Props) => {
    const {
      removeRolesFromTeam,
      removeRolesFromTeamError,
      removeRolesFromTeamLoading,
      addRolesToTeam,
      addRolesToTeamError,
      addRolesToTeamLoading,
    } = useTeams(team?.id);

    const { currentWorkspace, permissions } = useAppContext();
    const baseUrl = `/${currentWorkspace?.id}/settings`;

    const canEditTeam = permissions.canPerformTask("team.edit");

    const errorMessage = formatError(
      addRolesToTeamError || removeRolesFromTeamError
    );

    const handleAddRoles = (userIds: string[]) => {
      addRolesToTeam(userIds);
      onRoleRemoved && onRoleAdded(team);
    };

    const handleRemoveRoles = (userId: string) => {
      removeRolesFromTeam([userId]);
      onRoleRemoved && onRoleRemoved(team);
    };

    const roleCount = team?.roles?.length || 0;
    const loading = addRolesToTeamLoading || removeRolesFromTeamLoading;

    return (
      <>
        <FlexItem
          margin={EnumFlexItemMargin.Bottom}
          itemsAlign={EnumItemsAlign.Center}
          start={
            <Text textStyle={EnumTextStyle.Tag}>
              {roleCount} {pluralize(roleCount, "Role", "Roles")}
            </Text>
          }
          end={
            team &&
            canEditTeam && (
              <AddTeamRole team={team} onAddRoles={handleAddRoles} />
            )
          }
        >
          {loading && <CircularProgress />}
        </FlexItem>
        <List>
          {team?.roles?.map((role) => (
            <ListItem
              start={<Icon icon="roles_outline" />}
              to={`${baseUrl}/roles/${role.id}`}
              end={
                canEditTeam && (
                  <Button
                    icon="trash_2"
                    buttonStyle={EnumButtonStyle.Text}
                    onClick={(e) => {
                      handleRemoveRoles(role.id);
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  />
                )
              }
              key={role.id}
            >
              <Text textStyle={EnumTextStyle.Description}>{role.name}</Text>
            </ListItem>
          ))}
        </List>
        <Snackbar
          open={
            Boolean(addRolesToTeamError) || Boolean(removeRolesFromTeamError)
          }
          message={errorMessage}
        />
      </>
    );
  }
);

export default TeamRoleList;
