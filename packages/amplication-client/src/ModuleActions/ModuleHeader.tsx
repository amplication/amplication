import {
  EnumApiOperationTagStyle,
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  SearchField,
  TabContentTitle,
  Text,
  Toggle,
} from "@amplication/ui/design-system";
import { BillingFeature } from "@amplication/util-billing-types";
import React from "react";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "../Components/FeatureIndicatorContainer";
import { ModuleActionsDisabled } from "./ModuleActionsDisabled";

const CLASS_NAME = "module-actions";

type Props = {
  title: string;
  subTitle: string;
  showApiToggle?: boolean;
  displayMode: EnumApiOperationTagStyle;
  handleDisplayModeChange: (checked: boolean) => void;
  handleSearchChange: (value: string) => void;
};

const ModuleHeader = React.memo(
  ({
    handleSearchChange,
    handleDisplayModeChange,
    showApiToggle,
    displayMode,
    title,
    subTitle,
  }: Props) => {
    return (
      <FeatureIndicatorContainer
        featureId={BillingFeature.CustomActions}
        entitlementType={EntitlementType.Boolean}
        render={({ disabled, icon }) => (
          <>
            {disabled ? (
              <ModuleActionsDisabled className={CLASS_NAME} />
            ) : (
              <>
                <FlexItem
                  start={<TabContentTitle title={title} subTitle={subTitle} />}
                  end={
                    <SearchField
                      label="search"
                      placeholder="Search"
                      onChange={handleSearchChange}
                    />
                  }
                ></FlexItem>
                {showApiToggle && (
                  <FlexItem
                    direction={EnumFlexDirection.Row}
                    className={`${CLASS_NAME}__api-toggle`}
                    contentAlign={
                      disabled
                        ? EnumContentAlign.Center
                        : EnumContentAlign.Start
                    }
                    itemsAlign={EnumItemsAlign.Center}
                  >
                    <Text
                      textStyle={EnumTextStyle.Tag}
                      textColor={
                        displayMode === EnumApiOperationTagStyle.GQL
                          ? EnumTextColor.White
                          : EnumTextColor.Black20
                      }
                    >
                      GraphQL API
                    </Text>
                    <div className={`module-toggle-field__operation-toggle`}>
                      <Toggle
                        checked={displayMode === EnumApiOperationTagStyle.REST}
                        onValueChange={handleDisplayModeChange}
                      />
                    </div>
                    <Text
                      textStyle={EnumTextStyle.Tag}
                      textColor={
                        displayMode === EnumApiOperationTagStyle.REST
                          ? EnumTextColor.White
                          : EnumTextColor.Black20
                      }
                    >
                      REST API
                    </Text>
                  </FlexItem>
                )}
              </>
            )}
          </>
        )}
      />
    );
  }
);

export default ModuleHeader;
