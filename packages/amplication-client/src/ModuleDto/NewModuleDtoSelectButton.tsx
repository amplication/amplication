import {
  CircleBadge,
  EnumIconPosition,
  EnumItemsAlign,
  EnumTextColor,
  FlexItem,
  Icon,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import { useCallback, useState } from "react";
import { EnumButtonStyle } from "../Components/Button";
import { useModulesContext } from "../Modules/modulesContext";
import { REACT_APP_FEATURE_CUSTOM_ACTIONS_ENABLED } from "../env";
import * as models from "../models";
import NewModuleDtoEnum from "./NewModuleDtoEnum";
import NewModuleDto from "./NewModuleDto";

type Props = {
  resourceId: string;
  moduleId: string;
  onDtoCreated?: (moduleAction: models.ModuleDto) => void;
};

const NewModuleDtoSelectButton = ({
  resourceId,
  moduleId,
  onDtoCreated,
}: Props) => {
  const { customActionsLicenseEnabled } = useModulesContext();
  const [newEnumOpen, setNewEnumOpen] = useState<boolean>(false);
  const [newDtoOpen, setNewDtoOpen] = useState<boolean>(false);

  const onNewEnumSelected = useCallback(() => {
    setNewEnumOpen(true);
  }, [setNewEnumOpen]);

  const onNewEnumDismiss = useCallback(() => {
    setNewEnumOpen(false);
  }, [setNewEnumOpen]);

  const onNewEnumCreated = useCallback(
    (moduleAction: models.ModuleDto) => {
      if (onDtoCreated) {
        onDtoCreated(moduleAction);
      }
      setNewEnumOpen(false);
    },
    [onDtoCreated, setNewEnumOpen]
  );

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
      {newEnumOpen && (
        <NewModuleDtoEnum
          resourceId={resourceId}
          moduleId={moduleId}
          onDismiss={onNewEnumDismiss}
          onDtoCreated={onNewEnumCreated}
        />
      )}

      {newDtoOpen && (
        <NewModuleDto
          resourceId={resourceId}
          moduleId={moduleId}
          onDismiss={onNewDtoDismiss}
          onDtoCreated={onNewDtoCreated}
        />
      )}

      {REACT_APP_FEATURE_CUSTOM_ACTIONS_ENABLED === "true" && (
        <SelectMenu
          title={"Add DTO"}
          buttonStyle={EnumButtonStyle.Primary}
          hideSelectedItemsIndication
          disabled={!customActionsLicenseEnabled}
          icon={"zap"}
          buttonIconPosition={EnumIconPosition.Left}
        >
          <SelectMenuModal align="right" withCaret>
            <SelectMenuList>
              <SelectMenuItem
                closeAfterSelectionChange
                onSelectionChange={onNewDtoSelected}
              >
                <FlexItem itemsAlign={EnumItemsAlign.Center}>
                  <CircleBadge
                    color={EnumTextColor.ThemeTurquoise}
                    size={"small"}
                  >
                    <Icon icon={"zap"} size={"small"} />
                  </CircleBadge>
                  <span>Add DTO</span>
                </FlexItem>
              </SelectMenuItem>
              <SelectMenuItem
                closeAfterSelectionChange
                onSelectionChange={onNewEnumSelected}
              >
                <FlexItem itemsAlign={EnumItemsAlign.Center}>
                  <CircleBadge
                    color={EnumTextColor.ThemeTurquoise}
                    size={"small"}
                  >
                    <Icon icon={"zap"} size={"small"} />
                  </CircleBadge>
                  <span>Add Enum</span>
                </FlexItem>
              </SelectMenuItem>
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      )}
    </div>
  );
};

export default NewModuleDtoSelectButton;
