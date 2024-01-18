import {
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  SearchField,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import React from "react";
import { FeatureIndicator } from "../Components/FeatureIndicator";
import { BillingFeature } from "@amplication/util-billing-types";
import { IconType } from "../Components/FeatureIndicatorContainer";

type Props = {
  icon: IconType;
  handleSearchChange: (value: string) => void;
  className: string;
};

export const ModuleActionsEnabled: React.FC<Props> = ({
  icon,
  handleSearchChange,
  className,
}) => {
  return (
    <>
      <div className={`${className}__search-field`}>
        <SearchField
          label="search"
          placeholder="Search"
          onChange={handleSearchChange}
        />
      </div>
      <FlexItem
        itemsAlign={EnumItemsAlign.Start}
        margin={EnumFlexItemMargin.Top}
        start={
          <TabContentTitle
            title="Module Actions"
            subTitle="Actions are used to perform operations on resources, with or without API endpoints."
          />
        }
        end={
          icon && (
            <FeatureIndicator
              featureName={BillingFeature.CustomActions}
              placement="bottom-end"
              icon={icon}
              element={
                <div className={`${className}__feature-tag`}>
                  <Text
                    textStyle={EnumTextStyle.Tag}
                    textColor={EnumTextColor.Black}
                  >
                    Premium feature
                  </Text>
                  <Icon
                    icon={icon}
                    size={"xsmall"}
                    color={EnumTextColor.Black}
                  />
                </div>
              }
            />
          )
        }
      ></FlexItem>
    </>
  );
};
