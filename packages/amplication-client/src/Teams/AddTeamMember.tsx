import { useEffect } from "react";
import * as models from "../models";
import useTeam from "./hooks/useTeams";

type Props = {
  team: models.Team;
  onMemberAdded?: (team: models.Team) => void;
};

const CLASS_NAME = "add-team-member";

const AddTeamMember = ({ team, onMemberAdded }: Props) => {
  const {
    getAvailableWorkspaceMembers,
    availableWorkspaceMembers,
    addMembersToTeam,
  } = useTeam(team?.id);

  const handleAddMember = (userId: string) => {
    addMembersToTeam([userId]);
  };

  useEffect(() => {
    getAvailableWorkspaceMembers();
  }, []);

  return (
    <div className={CLASS_NAME}>
      {availableWorkspaceMembers.map((member, index) => (
        <div
          onClick={() => {
            handleAddMember(member.id);
          }}
          key={index}
        >
          {member.account.email}
        </div>
      ))}
    </div>
  );
};

export default AddTeamMember;
