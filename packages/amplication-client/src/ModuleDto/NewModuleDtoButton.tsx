import { Button } from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import { EnumButtonStyle } from "../Components/Button";
import { useModulesContext } from "../Modules/modulesContext";
import { REACT_APP_FEATURE_CUSTOM_ACTIONS_ENABLED } from "../env";
import * as models from "../models";
import NewModuleDto from "./NewModuleDto";

type Props = {
  resourceId: string;
  moduleId: string;
  onDtoCreated?: (moduleAction: models.ModuleDto) => void;
  buttonStyle?: EnumButtonStyle;
  navigateToDtoOnCreate?: boolean;
};

const NewModuleDtoButton = ({
  resourceId,
  moduleId,
  onDtoCreated,
  buttonStyle = EnumButtonStyle.Text,
  navigateToDtoOnCreate = true,
}: Props) => {
  const { customActionsLicenseEnabled } = useModulesContext();
  const [newDtoOpen, setNewDtoOpen] = useState<boolean>(false);

  const onNewDtoSelected = useCallback(() => {
    setNewDtoOpen(true);
  }, [setNewDtoOpen]);

  const onNewDtoDismiss = useCallback(() => {
    setNewDtoOpen(false);
  }, [setNewDtoOpen]);

  const onNewDtoCreated = useCallback(
    (moduleAction: models.ModuleDto) => {
      if (onDtoCreated) {
        onDtoCreated(moduleAction);
      }
      setNewDtoOpen(false);
    },
    [onDtoCreated, setNewDtoOpen]
  );

  return (
    <div>
      {newDtoOpen && (
        <NewModuleDto
          resourceId={resourceId}
          moduleId={moduleId}
          onDismiss={onNewDtoDismiss}
          onDtoCreated={onNewDtoCreated}
          navigateToDtoOnCreate={navigateToDtoOnCreate}
        />
      )}

      {REACT_APP_FEATURE_CUSTOM_ACTIONS_ENABLED === "true" && (
        <Button
          buttonStyle={buttonStyle}
          onClick={onNewDtoSelected}
          disabled={!customActionsLicenseEnabled}
          icon="zap"
        >
          Add DTO
        </Button>
      )}
    </div>
  );
};

export default NewModuleDtoButton;
