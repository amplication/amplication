import { Button, Dialog, EnumButtonStyle } from "@amplication/ui/design-system";
import { useState } from "react";
import * as models from "../models";
import SelectTeams from "./SelectTeams";

type Props = {
  TeamAssignments: models.TeamAssignment[];
  onAddTeams: (userIds: string[]) => void;
  buttonStyle?: EnumButtonStyle;
};

const SelectTeamsButton = ({
  TeamAssignments,
  onAddTeams,
  buttonStyle = EnumButtonStyle.Outline,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTeamsSelected = (teamIds: string[]) => {
    onAddTeams(teamIds);
    setIsOpen(false);
  };

  const selectedTeams =
    TeamAssignments?.map((assignment) => assignment.teamId) || [];

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        title="Add Teams"
      >
        {isOpen && (
          <SelectTeams
            filteredTeamIds={selectedTeams}
            onSelectTeams={handleTeamsSelected}
          />
        )}
      </Dialog>

      <Button
        buttonStyle={buttonStyle}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Add Teams
      </Button>
    </>
  );
};

export default SelectTeamsButton;
