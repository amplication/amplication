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
  SearchField,
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
import { useCallback } from "react";
import { BillingFeature } from "@amplication/util-billing-types";
import {
  FeatureIndicatorContainer,
  EntitlementType,
} from "../../Components/FeatureIndicatorContainer";

export const CLASS_NAME = "model-organizer-toolbar";

type Props = {
  readOnly: boolean;
  hasChanges: boolean;
  onApplyPlan: () => void;
  searchPhraseChanged: (searchPhrase: string) => void;
  onRedesign: (resource: models.Resource) => void;
  resources: models.Resource[];
};

export default function ModelOrganizerToolbar({
  readOnly,
  hasChanges,
  resources,
  onApplyPlan,
  searchPhraseChanged,
  onRedesign,
}: Props) {
  const handleSearchPhraseChanged = useCallback(
    (searchPhrase: string) => {
      searchPhraseChanged(searchPhrase);
    },
    [searchPhraseChanged]
  );

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
            <FeatureIndicatorContainer
              featureId={BillingFeature.RedesignArchitecture}
              entitlementType={EntitlementType.Boolean}
              limitationText="Available as part of the Enterprise plan only."
            >
              <Button
                buttonStyle={EnumButtonStyle.Outline}
                // eventData={{
                //   eventName: AnalyticsEventNames.ImportPrismaSchemaClick,
                // }}
              >
                AI Helper
              </Button>
            </FeatureIndicatorContainer>

            {!readOnly && (
              <FeatureIndicatorContainer
                featureId={BillingFeature.RedesignArchitecture}
                entitlementType={EntitlementType.Boolean}
                limitationText="Available as part of the Enterprise plan only."
              >
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
              </FeatureIndicatorContainer>
            )}
            {readOnly && (
              <FeatureIndicatorContainer
                featureId={BillingFeature.RedesignArchitecture}
                entitlementType={EntitlementType.Boolean}
                limitationText="Available as part of the Enterprise plan only."
              >
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
              </FeatureIndicatorContainer>
            )}
            <SearchField
              label="search"
              placeholder="search"
              onChange={handleSearchPhraseChanged}
            />
          </FlexItem>
        </FlexEnd>
      </FlexItem>
    </div>
  );
}
