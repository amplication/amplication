import { Button, Dialog, EnumButtonStyle } from "@amplication/ui/design-system";
import { useState } from "react";
import * as models from "../models";
import UserAddTeams from "./UserAddTeams";
import { useAppContext } from "../context/appContext";

type Props = {
  user: models.User;
  onAddTeams: (teamIds: string[]) => void;
};

const UserAddTeamsButton = ({ user, onAddTeams }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddTeams = (teamIds: string[]) => {
    onAddTeams(teamIds);
    setIsOpen(false);
  };

  const { permissions } = useAppContext();

  const canAddTeamMember = permissions.canPerformTask("team.member.add");

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        title="Add Teams"
      >
        {isOpen && <UserAddTeams user={user} onAddTeams={handleAddTeams} />}
      </Dialog>
      {canAddTeamMember && (
        <Button
          buttonStyle={EnumButtonStyle.Outline}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Add to Teams
        </Button>
      )}
    </>
  );
};

export default UserAddTeamsButton;
