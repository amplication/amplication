import {
  EnumButtonStyle,
  EnumTextColor,
  EnumTextStyle,
  SelectMenu,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import React from "react";
import * as models from "../models";
import "./CreateResourceButton.scss";
import { BillingFeature } from "@amplication/util-billing-types";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "./FeatureIndicatorContainer";
import RedesignResourceButtonItem from "./RedesignResourceButtonItem";

const CLASS_NAME = "create-resource-button";

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
        <SelectMenu title="Redesign" buttonStyle={EnumButtonStyle.Primary}>
          <SelectMenuModal align="right">
            <SelectMenuList>
              <Text
                className={`${CLASS_NAME}__selectMonoTag`}
                textStyle={EnumTextStyle.Tag}
                textColor={EnumTextColor.Black20}
              >
                {"Select Monolith"}
              </Text>
              {resources.map((item, index) => (
                <RedesignResourceButtonItem
                  resource={item}
                  key={index}
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
