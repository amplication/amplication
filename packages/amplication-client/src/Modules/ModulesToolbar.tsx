import {
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumPanelStyle,
  FlexItem,
  Panel,
  SearchField,
} from "@amplication/ui/design-system";
import { EnumFlexDirection } from "@amplication/ui/design-system/components/FlexItem/FlexItem";
import React, { useCallback } from "react";
import NewModuleAction from "../ModuleActions/NewModuleAction";
import NewModuleDtoSelectButton from "../ModuleDto/NewModuleDtoSelectButton";
import "./ModulesToolbar.scss";
import { useModulesContext } from "./modulesContext";
import NewModuleDtoButton from "../ModuleDto/NewModuleDtoButton";

type Props = {
  resourceId: string;
  moduleId: string;
};

const CLASS_NAME = "modules-toolbar";

const ModulesToolbar: React.FC<Props> = ({ moduleId, resourceId }) => {
  const { setSearchPhrase } = useModulesContext();

  let timeout;
  const handleSearchChange = useCallback(
    (value) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSearchPhrase(value);
      }, 750);
    },
    [setSearchPhrase, timeout]
  );

  return (
    <Panel panelStyle={EnumPanelStyle.Bold} className={CLASS_NAME}>
      <FlexItem
        margin={EnumFlexItemMargin.None}
        itemsAlign={EnumItemsAlign.Center}
        start={
          <SearchField
            label="search"
            placeholder="Search"
            onChange={handleSearchChange}
          />
        }
      >
        <FlexItem.FlexEnd direction={EnumFlexDirection.Row}>
          <>
            <NewModuleDtoSelectButton
              resourceId={resourceId}
              moduleId={moduleId}
            />
            <NewModuleAction
              resourceId={resourceId}
              moduleId={moduleId}
              buttonStyle={EnumButtonStyle.Primary}
            />
          </>
        </FlexItem.FlexEnd>
      </FlexItem>
    </Panel>
  );
};

export default ModulesToolbar;
