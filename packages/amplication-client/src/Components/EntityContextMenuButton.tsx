import {
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumTextStyle,
  FlexItem,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import "./EntityContextMenuButton.scss";
import { useCallback } from "react";

const CLASS_NAME = "entity-context-menu-button";

type Props = {
  onSelectRelatedEntities: () => void;
};

export default function EntityContextMenuButton({
  onSelectRelatedEntities,
}: Props) {
  const handleSelectRelatedEntitiesClicked = useCallback(() => {
    onSelectRelatedEntities();
  }, [onSelectRelatedEntities]);

  return (
    <div className={CLASS_NAME}>
      <SelectMenu
        title="..."
        buttonStyle={EnumButtonStyle.Text}
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
              closeAfterSelectionChange
              onSelectionChange={handleSelectRelatedEntitiesClicked}
            >
              <Text
                key={"selectRelatedEntities"}
                textStyle={EnumTextStyle.Normal}
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
