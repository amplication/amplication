import {
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/design-system";
import React from "react";
import {
  EnumMessagePatternConnectionOptions,
  MessagePattern,
} from "../../models";

export type FormValues = {
  patternType: EnumMessagePatternConnectionOptions;
  topicId: string;
};

type Props = {
  selectedPatternType: MessagePattern;
  onMessagePatternTypeChange: (
    pattern: EnumMessagePatternConnectionOptions
  ) => void;
};

export default function ServiceConnectionTopicItemForm({
  selectedPatternType,
  onMessagePatternTypeChange,
}: Props) {
  return (
    <SelectMenu title={selectedPatternType.type}>
      <SelectMenuModal>
        <SelectMenuList>
          <>
            {Object.keys(EnumMessagePatternConnectionOptions).map(
              (connectionOption, i) => (
                <SelectMenuItem
                  closeAfterSelectionChange
                  selected={selectedPatternType.type === connectionOption}
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
  );
}
