import {
  Button,
  CircularProgress,
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  List,
  ListItem,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import React from "react";
import { UserInfo } from "../../Components/UserInfo";
import * as models from "../../models";
import { formatError } from "../../util/error";
import { pluralize } from "../../util/pluralize";
import AddTeamMemberButton from "./AddTeamMemberButton";
import useTeams from "../hooks/useTeams";
import { useAppContext } from "../../context/appContext";

type Props = {
  team: models.Team;
  onMemberRemoved?: (team: models.Team) => void;
  onMemberAdded?: (team: models.Team) => void;
};

const TeamMemberList = React.memo(
  ({ team, onMemberRemoved, onMemberAdded }: Props) => {
    const { currentWorkspace, permissions } = useAppContext();
    const baseUrl = `/${currentWorkspace?.id}/settings`;

    const canAddMembers = permissions.canPerformTask("team.member.add");
    const canRemoveMembers = permissions.canPerformTask("team.member.remove");

    const {
      removeMembersFromTeam,
      removeMembersFromTeamError,
      removeMembersFromTeamLoading,
      addMembersToTeam,
      addMembersToTeamError,
      addMembersToTeamLoading,
    } = useTeams(team?.id);

    const errorMessage = formatError(
      addMembersToTeamError || removeMembersFromTeamError
    );

    const handleAddMembers = (userIds: string[]) => {
      addMembersToTeam(userIds);
      onMemberRemoved && onMemberAdded(team);
    };

    const handleRemoveMembers = (userId: string) => {
      removeMembersFromTeam(team.id, [userId]);
      onMemberRemoved && onMemberRemoved(team);
    };

    const memberCount = team?.members?.length || 0;
    const loading = addMembersToTeamLoading || removeMembersFromTeamLoading;

    return (
      <>
        <FlexItem
          margin={EnumFlexItemMargin.Bottom}
          itemsAlign={EnumItemsAlign.Center}
          start={
            <Text textStyle={EnumTextStyle.Tag}>
              {memberCount} {pluralize(memberCount, "Member", "Members")}
            </Text>
          }
          end={
            team &&
            canAddMembers && (
              <AddTeamMemberButton
                team={team}
                onAddMembers={handleAddMembers}
              />
            )
          }
        >
          {loading && <CircularProgress />}
        </FlexItem>
        <List>
          {team?.members?.map((member, index) => (
            <ListItem
              to={`${baseUrl}/members/${member.id}`}
              end={
                canRemoveMembers && (
                  <Button
                    icon="trash_2"
                    buttonStyle={EnumButtonStyle.Text}
                    onClick={(e) => {
                      handleRemoveMembers(member.id);
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  />
                )
              }
              key={index}
            >
              <UserInfo user={member} />
            </ListItem>
          ))}
        </List>
        <Snackbar
          open={
            Boolean(addMembersToTeamError) ||
            Boolean(removeMembersFromTeamError)
          }
          message={errorMessage}
        />
      </>
    );
  }
);

export default TeamMemberList;
