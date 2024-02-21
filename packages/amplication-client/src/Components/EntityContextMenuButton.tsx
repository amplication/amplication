import {
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumTextAlign,
  EnumTextStyle,
  FlexItem,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import "./EntityContextMenuButton.scss";
import { useCallback, useState } from "react";

const CLASS_NAME = "entity-context-menu-button";

type Props = {
  onSelectRelatedEntities: () => void;
};

export default function EntityContextMenuButton({
  onSelectRelatedEntities,
}: Props) {
  const [isSelectedRelatedEntities, setIsSelectedRelatedEntities] =
    useState<boolean>(false);

  const handleSelectRelatedEntitiesClicked = useCallback(() => {
    onSelectRelatedEntities();
    setIsSelectedRelatedEntities(!isSelectedRelatedEntities);
  }, [isSelectedRelatedEntities, onSelectRelatedEntities]);

  return (
    <div className={CLASS_NAME}>
      <SelectMenu
        title="..."
        buttonStyle={EnumButtonStyle.Text}
        hideSelectedItemsIndication={false}
        className={`${CLASS_NAME}__menu`}
      >
        {" "}
        <SelectMenuModal align="right" withCaret>
          <SelectMenuList>
            <FlexItem
              margin={EnumFlexItemMargin.Both}
              className={`${CLASS_NAME}__list-header`}
            >
              {" "}
              <span className={`${CLASS_NAME}__menu-title`}>{"Options"}</span>
            </FlexItem>
            <SelectMenuItem
              selected={isSelectedRelatedEntities}
              closeAfterSelectionChange
              onSelectionChange={handleSelectRelatedEntitiesClicked}
            >
              <Text
                key={"selectRelatedEntities"}
                textStyle={EnumTextStyle.Normal}
                textAlign={EnumTextAlign.Left}
              >
                Select all related entities
              </Text>
            </SelectMenuItem>
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    </div>
  );
}
