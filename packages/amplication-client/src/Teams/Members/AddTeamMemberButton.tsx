import { Button, Dialog, EnumButtonStyle } from "@amplication/ui/design-system";
import { useState } from "react";
import * as models from "../../models";
import AddTeamMember from "./AddTeamMember";

type Props = {
  team: models.Team;
  onAddMembers: (userIds: string[]) => void;
};

const AddTeamMemberButton = ({ team, onAddMembers }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddTeamMember = (userIds: string[]) => {
    onAddMembers(userIds);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        title="Add Member"
      >
        {isOpen && (
          <AddTeamMember team={team} onAddMembers={handleAddTeamMember} />
        )}
      </Dialog>

      <Button
        buttonStyle={EnumButtonStyle.Outline}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Add Member
      </Button>
    </>
  );
};

export default AddTeamMemberButton;
