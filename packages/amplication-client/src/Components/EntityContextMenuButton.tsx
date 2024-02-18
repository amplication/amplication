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
import React from "react";
import "./RedesignResourceButton.scss";

const CLASS_NAME = "redesign-resource-button";

type Props = {
  onSelectRelatedEntities: () => void;
};

const EntityContextMenuButton: React.FC<Props> = ({
  onSelectRelatedEntities,
}) => {
  return (
    <div>
      <SelectMenu
        // icon={icon}
        title="..."
        buttonStyle={EnumButtonStyle.Primary}
        hideSelectedItemsIndication={false}
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
                Options
              </Text>
            </FlexItem>
            <SelectMenuItem
              closeAfterSelectionChange={false}
              //selected={}
              //itemData={resource}
              onSelectionChange={onSelectRelatedEntities}
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
      {/* <SelectMenu
        title="..."
        buttonStyle={EnumButtonStyle.Primary}
        hideSelectedItemsIndication
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
                Select Service to start redesign
              </Text>
            </FlexItem>
            <SelectMenuItem
              closeAfterSelectionChange={false}
              selected
              //itemData={resource}
              onSelectionChange={onSelectRelatedEntities}
            >
              <Text>Select all related entities</Text>
            </SelectMenuItem>
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu> */}
    </div>
  );
};

export default EntityContextMenuButton;
