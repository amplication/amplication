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
  Button,
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
        fullEnterpriseText="Redesign your system architecture by breaking a monolith Service into microservices"
        render={({ disabled, icon }) => (
          <>
            {resources.length > 1 ? (
              <SelectMenu
                icon={icon}
                title="Redesign"
                buttonStyle={EnumButtonStyle.Primary}
                hideSelectedItemsIndication
                disabled={disabled}
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
            ) : (
              <Button
                buttonStyle={EnumButtonStyle.Primary}
                icon={icon}
                disabled={resources.length === 0}
                onClick={() => {
                  onSelectResource(resources[0]);
                }}
              >
                Redesign
              </Button>
            )}
          </>
        )}
      ></FeatureIndicatorContainer>
    </div>
  );
};

export default RedesignResourceButton;
