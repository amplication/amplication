import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import React, { useMemo } from "react";
import * as models from "../models";
import "./CreateResourceButton.scss";
import CreateResourceButtonItem from "./CreateResourceButtonItem";
import { BillingFeature } from "@amplication/util-billing-types";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "./FeatureIndicatorContainer";
import { useStiggContext } from "@stigg/react-sdk";

const CLASS_NAME = "create-resource-button";

export type CreateResourceButtonItemType = {
  type: models.EnumResourceType;
  label: string;
  route: string;
  info: string;
  licenseRequired?: BillingFeature;
};

const ITEMS: CreateResourceButtonItemType[] = [
  {
    type: models.EnumResourceType.Service,
    label: "Service",
    route: "create-resource",
    info: "Create a service with your choice of APIs, database, and authentication",
  },
  {
    type: models.EnumResourceType.MessageBroker,
    label: "Message Broker",
    route: "create-broker",
    info: "Create a message broker to facilitate communication between services",
  },
];

type Props = {
  resourcesLength: number;
  servicesLength: number;
};

const CreateResourceButton: React.FC<Props> = ({
  resourcesLength,
  servicesLength,
}) => {
  const { stigg } = useStiggContext();

  const { hasAccess: canUsePrivatePlugins } = stigg.getBooleanEntitlement({
    featureId: BillingFeature.PrivatePlugins,
  });

  const licensedItems = useMemo(() => {
    const licenses = {
      [BillingFeature.PrivatePlugins]: canUsePrivatePlugins,
    };
    return ITEMS.filter(
      (item) => !item.licenseRequired || licenses[item.licenseRequired]
    );
  }, [canUsePrivatePlugins]);

  return (
    <div className={CLASS_NAME}>
      <FeatureIndicatorContainer
        featureId={BillingFeature.Services}
        entitlementType={EntitlementType.Metered}
        limitationText="You have reached the maximum number of services allowed. "
        actualUsage={servicesLength}
        paidPlansExclusive={false}
      >
        <SelectMenu title="Add Resource" buttonStyle={EnumButtonStyle.Primary}>
          <SelectMenuModal align="right" withCaret>
            <SelectMenuList>
              {licensedItems.map((item, index) => (
                <CreateResourceButtonItem item={item} key={index} />
              ))}
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      </FeatureIndicatorContainer>
    </div>
  );
};

export default CreateResourceButton;
