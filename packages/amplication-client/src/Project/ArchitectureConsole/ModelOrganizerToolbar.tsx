import "./ModelOrganizerToolbar.scss";

import {
  EnumButtonStyle,
  EnumContentAlign,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import { Button } from "../../Components/Button";
import { FlexEnd } from "@amplication/ui/design-system/components/FlexItem/FlexItem";
import * as models from "../../models";
import ResourceCircleBadge from "../../Components/ResourceCircleBadge";

export const CLASS_NAME = "model-organizer-toolbar";

type Props = {
  readOnly: boolean;
  hasChanges: boolean;
  onApplyPlan: () => void;
  onRedesign: (resource: models.Resource) => void;
  onCancelChanges: () => void;
  resources: models.Resource[];
};

export default function ModelOrganizerToolbar({
  readOnly,
  hasChanges,
  resources,
  onApplyPlan,
  onCancelChanges,
  onRedesign,
}: Props) {
  return (
    <div className={CLASS_NAME}>
      <FlexItem
        itemsAlign={EnumItemsAlign.Center}
        contentAlign={EnumContentAlign.Start}
        gap={EnumGapSize.Large}
        margin={EnumFlexItemMargin.Both}
      >
        <Text
          textStyle={EnumTextStyle.Label}
          textColor={EnumTextColor.ThemeRed}
        >
          {readOnly ? "Read Only" : "Edit Mode"}
        </Text>

        <FlexEnd>
          <FlexItem>
            <Button
              buttonStyle={EnumButtonStyle.Outline}
              // eventData={{
              //   eventName: AnalyticsEventNames.ImportPrismaSchemaClick,
              // }}
            >
              AI Helper
            </Button>
            {!readOnly && (
              <>
                <Button
                  buttonStyle={EnumButtonStyle.Outline}
                  onClick={onCancelChanges}
                  // eventData={{
                  //   eventName: AnalyticsEventNames.ImportPrismaSchemaClick,
                  // }}
                  disabled={!hasChanges}
                >
                  Cancel Changes
                </Button>
                <Button
                  buttonStyle={EnumButtonStyle.Primary}
                  onClick={onApplyPlan}
                  // eventData={{
                  //   eventName: AnalyticsEventNames.ImportPrismaSchemaClick,
                  // }}
                  disabled={!hasChanges}
                >
                  Apply Plan
                </Button>
              </>
            )}
            {readOnly && (
              <SelectMenu
                title="Redesign"
                buttonStyle={EnumButtonStyle.Primary}
              >
                <SelectMenuModal align="left">
                  <SelectMenuList>
                    {resources?.map((resource) => (
                      <SelectMenuItem
                        key={resource.id}
                        closeAfterSelectionChange
                        itemData={resource}
                        onSelectionChange={onRedesign}
                        as="span"
                      >
                        <ResourceCircleBadge
                          type={resource.resourceType}
                          size="small"
                        />
                        <span>{resource.name}</span>
                      </SelectMenuItem>
                    ))}
                  </SelectMenuList>
                </SelectMenuModal>
              </SelectMenu>
            )}
          </FlexItem>
        </FlexEnd>
      </FlexItem>
    </div>
  );
}
