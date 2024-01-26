import {
  EnumApiOperationTagStyle,
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
        <FlexItem margin={EnumFlexItemMargin.Top}>
          <Text textStyle={EnumTextStyle.Normal}>Actions</Text>
        </FlexItem>

        <FlexItem margin={EnumFlexItemMargin.Top}>
          <ModuleActionList
            module={module}
            searchPhrase={searchPhrase}
            displayMode={displayMode}
            disabled={disabled}
          />
        </FlexItem>
        <FlexItem margin={EnumFlexItemMargin.Top}>
          <Text textStyle={EnumTextStyle.Normal}>DTOs</Text>
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
