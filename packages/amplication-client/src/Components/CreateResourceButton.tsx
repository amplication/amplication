import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import React from "react";
import * as models from "../models";
import "./CreateResourceButton.scss";
import CreateResourceButtonItem from "./CreateResourceButtonItem";
import { BillingFeature } from "@amplication/util-billing-types";
import {
  EntitlementType,
  FeatureControlContainer,
} from "./FeatureControlContainer";

const CLASS_NAME = "create-resource-button";

export type CreateResourceButtonItemType = {
  type: models.EnumResourceType;
  label: string;
  route: string;
  info: string;
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

const CreateResourceButton = ({
  resourcesLength,
}: {
  resourcesLength: number;
}) => {
  return (
    <div className={CLASS_NAME}>
      <FeatureControlContainer
        featureId={BillingFeature.Services}
        entitlementType={EntitlementType.Metered}
        meteredFeatureLength={resourcesLength}
      >
        <SelectMenu title="Add Resource" buttonStyle={EnumButtonStyle.Primary}>
          <SelectMenuModal align="right">
            <SelectMenuList>
              {ITEMS.map((item, index) => (
                <CreateResourceButtonItem item={item} key={index} />
              ))}
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      </FeatureControlContainer>
    </div>
  );
};

export default CreateResourceButton;
