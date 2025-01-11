import {
  EnumApiOperationTagStyle,
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Text,
} from "@amplication/ui/design-system";
import React from "react";
import * as models from "../models";

import ModuleDtoList from "../ModuleDto/ModuleDtoList";
import ModuleActionList from "./ModuleActionList";
import NewModuleDto from "../ModuleDto/NewModuleDto";
import {
  EnumFlexDirection,
  EnumItemsAlign,
} from "@amplication/ui/design-system";
import NewModuleAction from "./NewModuleAction";
import NewModuleDtoEnum from "../ModuleDto/NewModuleDtoEnum";

type Props = {
  module: models.Module;
  displayMode: EnumApiOperationTagStyle;
  searchPhrase: string;
  disabled?: boolean;
};
const ModuleActionsAndTypes = React.memo(
  ({ module, displayMode, searchPhrase, disabled }: Props) => {
    return (
      <>
        <FlexItem
          margin={EnumFlexItemMargin.Top}
          itemsAlign={EnumItemsAlign.Center}
        >
          <Text textStyle={EnumTextStyle.H4}>Actions</Text>
        </FlexItem>

        <FlexItem margin={EnumFlexItemMargin.Top}>
          <ModuleActionList
            module={module}
            searchPhrase={searchPhrase}
            displayMode={displayMode}
            disabled={disabled}
          />
        </FlexItem>
        <HorizontalRule doubleSpacing />
        <FlexItem margin={EnumFlexItemMargin.Top}>
          <Text textStyle={EnumTextStyle.H4}>DTOs</Text>
        </FlexItem>
        <FlexItem margin={EnumFlexItemMargin.Both}>
          <ModuleDtoList
            moduleId={module.id}
            resourceId={module.resourceId}
            searchPhrase={searchPhrase}
            disabled={disabled}
          />
        </FlexItem>
      </>
    );
  }
);

export default ModuleActionsAndTypes;
