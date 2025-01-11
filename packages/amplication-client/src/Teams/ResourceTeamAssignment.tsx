import {
  Button,
  CircularProgress,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  PanelCollapsible,
  Snackbar,
  Tag,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useMemo } from "react";
import RoleSelector from "../Components/RoleSelector";
import { TeamInfo } from "../Components/TeamInfo";
import * as models from "../models";
import { formatError } from "../util/error";
import { DeleteResourceTeamAssignment } from "./DeleteResourceTeamAssignment";
import useResourceTeamAssignments from "./hooks/useResourceTeamAssignments";

type Props = {
  resourceTeamAssignment: models.TeamAssignment;
};

const ResourceTeamAssignment = ({ resourceTeamAssignment }: Props) => {
  const {
    addRolesToTeamAssignment,
    addRolesToTeamAssignmentError,
    addRolesToTeamAssignmentLoading,
    removeRolesFromTeamAssignment,
    removeRolesFromTeamAssignmentError,
    removeRolesFromTeamAssignmentLoading,
    deleteTeamAssignment,
    deleteTeamAssignmentError,
    deleteTeamAssignmentLoading,
  } = useResourceTeamAssignments(resourceTeamAssignment.resourceId);

  const hasError =
    Boolean(addRolesToTeamAssignmentError) ||
    Boolean(removeRolesFromTeamAssignmentError) ||
    Boolean(deleteTeamAssignmentError);
  const errorMessage =
    formatError(addRolesToTeamAssignmentError) ||
    formatError(removeRolesFromTeamAssignmentError) ||
    formatError(deleteTeamAssignmentError);

  const handleRolesChange = useCallback(
    (roleIds: string[]) => {
      const roleIdsToRemove = resourceTeamAssignment.roles
        .filter((role) => !roleIds.includes(role.id))
        .map((role) => role.id);

      const roleIdsToAdd = roleIds.filter(
        (roleId) =>
          !resourceTeamAssignment.roles.some((role) => role.id === roleId)
      );

      if (roleIdsToRemove.length > 0) {
        removeRolesFromTeamAssignment(
          resourceTeamAssignment.resourceId,
          resourceTeamAssignment.teamId,
          roleIdsToRemove
        );
      }

      if (roleIdsToAdd.length > 0) {
        addRolesToTeamAssignment(
          resourceTeamAssignment.resourceId,
          resourceTeamAssignment.teamId,
          roleIdsToAdd
        );
      }
    },
    [
      addRolesToTeamAssignment,
      removeRolesFromTeamAssignment,
      resourceTeamAssignment,
    ]
  );

  const handleDeleteTeam = useCallback(() => {
    deleteTeamAssignment({
      variables: {
        where: {
          resourceId: resourceTeamAssignment.resourceId,
          teamId: resourceTeamAssignment.teamId,
        },
      },
    });
  }, [deleteTeamAssignment, resourceTeamAssignment]);

  const handleRemoveRole = useCallback(
    (roleId: string) => {
      removeRolesFromTeamAssignment(
        resourceTeamAssignment.resourceId,
        resourceTeamAssignment.teamId,
        [roleId]
      );
    },
    [removeRolesFromTeamAssignment, resourceTeamAssignment]
  );

  const selectedRoles = useMemo(
    () => resourceTeamAssignment.roles.map((role) => role.id),
    [resourceTeamAssignment.roles]
  );

  return (
    <>
      <PanelCollapsible
        initiallyOpen
        manualCollapseDisabled={true}
        headerContent={
          <FlexItem gap={EnumGapSize.Small} itemsAlign={EnumItemsAlign.Center}>
            <TeamInfo team={resourceTeamAssignment.team} />
            {(addRolesToTeamAssignmentLoading ||
              removeRolesFromTeamAssignmentLoading ||
              deleteTeamAssignmentLoading) && <CircularProgress />}
            <FlexItem.FlexEnd>
              <FlexItem itemsAlign={EnumItemsAlign.Center}>
                <RoleSelector
                  filterSelectedValues
                  onChange={handleRolesChange}
                  selectedValues={selectedRoles}
                  buttonStyle={EnumButtonStyle.Text}
                />
                <DeleteResourceTeamAssignment
                  teamAssignment={resourceTeamAssignment}
                  onDelete={handleDeleteTeam}
                />
              </FlexItem>
            </FlexItem.FlexEnd>
          </FlexItem>
        }
      >
        {!resourceTeamAssignment.roles ||
        resourceTeamAssignment.roles.length === 0 ? (
          <Text textStyle={EnumTextStyle.Description}>
            No roles were selected for this team
          </Text>
        ) : (
          <FlexItem
            wrap
            direction={EnumFlexDirection.Row}
            itemsAlign={EnumItemsAlign.Center}
          >
            {resourceTeamAssignment.roles.map((role) => (
              <div key={role.id}>
                <FlexItem
                  gap={EnumGapSize.None}
                  itemsAlign={EnumItemsAlign.Center}
                >
                  <Button
                    type="button"
                    buttonStyle={EnumButtonStyle.Text}
                    onClick={() => handleRemoveRole(role.id)}
                  >
                    <Icon icon="close" />
                  </Button>
                  <Tag value={role.name} color={EnumTextColor.White} />
                  {/* <Text
                      textStyle={EnumTextStyle.Subtle}
                      textColor={EnumTextColor.Black}
                    >
                      {role.name}
                    </Text>
                  </Chip> */}
                </FlexItem>
              </div>
            ))}
          </FlexItem>
        )}
      </PanelCollapsible>
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default ResourceTeamAssignment;
