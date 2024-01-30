import {
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  SelectMenu,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import { BillingFeature } from "@amplication/util-billing-types";
import React from "react";
import * as models from "../models";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "./FeatureIndicatorContainer";
import "./RedesignResourceButton.scss";
import RedesignResourceButtonItem from "./RedesignResourceButtonItem";

const CLASS_NAME = "redesign-resource-button";

type Props = {
  resources: models.Resource[];
  onSelectResource: (resource: models.Resource) => void;
};

const RedesignResourceButton: React.FC<Props> = ({
  resources,
  onSelectResource,
}) => {
  return (
    <div className={CLASS_NAME}>
      <FeatureIndicatorContainer
        featureId={BillingFeature.RedesignArchitecture}
        entitlementType={EntitlementType.Boolean}
        limitationText="Available as part of the Enterprise plan only."
      >
        <SelectMenu
          title="Redesign"
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
              {resources.map((item) => (
                <RedesignResourceButtonItem
                  resource={item}
                  key={item.id}
                  onSelectResource={onSelectResource}
                />
              ))}
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      </FeatureIndicatorContainer>
    </div>
  );
};

export default RedesignResourceButton;
