import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import React from "react";
import { EnumMessagePatternConnectionOptions } from "../../models";
import "./ServiceTopicPatternMenu.scss";

type Props = {
  onMessagePatternTypeChange: (
    pattern: EnumMessagePatternConnectionOptions
  ) => void;
  selectedPatternType: EnumMessagePatternConnectionOptions;
};
const CLASS_NAME = "service-topic-pattern-menu";
export default function ServiceTopicPatternMenu({
  onMessagePatternTypeChange,
  selectedPatternType,
}: Props) {
  return (
    <div>
      <div className={`${CLASS_NAME}__label`}>Message pattern</div>
      <SelectMenu
        title={selectedPatternType}
        buttonStyle={EnumButtonStyle.Secondary}
        icon="chevron_down"
      >
        <SelectMenuModal>
          <SelectMenuList>
            <>
              {Object.keys(EnumMessagePatternConnectionOptions).map(
                (connectionOption, i) => (
                  <SelectMenuItem
                    closeAfterSelectionChange
                    selected={selectedPatternType === connectionOption}
                    key={i}
                    onSelectionChange={() => {
                      onMessagePatternTypeChange(
                        connectionOption as EnumMessagePatternConnectionOptions
                      );
                    }}
                  >
                    {connectionOption}
                  </SelectMenuItem>
                )
              )}
            </>
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    </div>
  );
}
