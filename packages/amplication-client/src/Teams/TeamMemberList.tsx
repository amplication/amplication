import { List } from "@amplication/ui/design-system";
import React from "react";
import * as models from "../models";
import AddTeamMember from "./AddTeamMember";

type Props = {
  team: models.Team;
  onMemberRemoved?: (team: models.Team) => void;
  onMemberAdded?: (team: models.Team) => void;
};

const TeamMemberList = React.memo(
  ({ team, onMemberRemoved, onMemberAdded }: Props) => {
    return (
      <>
        <List
          headerContent={
            team && <AddTeamMember team={team} onMemberAdded={onMemberAdded} />
          }
        >
          {team?.members?.map((member, index) => (
            <>{member?.account.email}</>
          ))}
        </List>
      </>
    );
  }
);

export default TeamMemberList;
