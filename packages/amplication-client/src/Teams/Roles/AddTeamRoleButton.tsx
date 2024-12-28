import { Button, Dialog, EnumButtonStyle } from "@amplication/ui/design-system";
import { useState } from "react";
import * as models from "../../models";
import AddTeamRole from "./AddTeamRole";

type Props = {
  team: models.Team;
  onAddRoles: (userIds: string[]) => void;
};

const AddTeamRoleButton = ({ team, onAddRoles }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddTeamRole = (userIds: string[]) => {
    onAddRoles(userIds);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        title="Add Role"
      >
        {isOpen && <AddTeamRole team={team} onAddRoles={handleAddTeamRole} />}
      </Dialog>

      <Button
        buttonStyle={EnumButtonStyle.Outline}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Add Roles
      </Button>
    </>
  );
};

export default AddTeamRoleButton;
