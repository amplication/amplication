import {
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumTextAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import "./RedesignResourceButton.scss";
import { useCallback, useState } from "react";

const CLASS_NAME = "redesign-resource-button"; //todo: create new css file

type Props = {
  isContextMenuEnable: boolean;
  onSelectRelatedEntities: () => void;
};

export default function EntityContextMenuButton({
  onSelectRelatedEntities,
  isContextMenuEnable,
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
        disabled={!isContextMenuEnable}
      >
        <SelectMenuModal align="right" withCaret>
          <SelectMenuList>
            <FlexItem
              margin={EnumFlexItemMargin.Both}
              className={`${CLASS_NAME}__list-header`}
            >
              <Text
                textStyle={EnumTextStyle.Tag}
                textColor={EnumTextColor.Black20}
              >
                {"menu"}
              </Text>
            </FlexItem>
            <SelectMenuItem
              selected={isSelectedRelatedEntities}
              closeAfterSelectionChange
              onSelectionChange={handleSelectRelatedEntitiesClicked}
            >
              <FlexItem>
                <Text
                  key={"selectRelatedEntities"}
                  textStyle={EnumTextStyle.Normal}
                  textAlign={EnumTextAlign.Left}
                >
                  Select all related entities
                </Text>
              </FlexItem>
            </SelectMenuItem>
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    </div>
  );
}
