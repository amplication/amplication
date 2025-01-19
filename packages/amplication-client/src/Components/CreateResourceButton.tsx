import {
  EnumButtonStyle,
  EnumItemsAlign,
  FlexItem,
  HorizontalRule,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import { BillingFeature } from "@amplication/util-billing-types";
import React from "react";
import { useHistory } from "react-router-dom";
import * as models from "../models";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "./FeatureIndicatorContainer";
import ResourceCircleBadge from "./ResourceCircleBadge";

const CLASS_NAME = "create-resource-button";

export type CreateResourceButtonItemType = {
  type: models.EnumResourceType;
  label: string;
  route?: string;
  info: string;
  showDivider?: boolean;
};

const ITEMS: CreateResourceButtonItemType[] = [
  {
    type: models.EnumResourceType.ServiceTemplate,
    label: "From Blueprint / Template",
    route: "new-resource",
    info: "Create a resource from a blueprint",
    showDivider: true,
  },

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

const CreateResourceButton: React.FC = () => {
  const history = useHistory();

  const { baseUrl } = useProjectBaseUrl({ overrideIsPlatformConsole: false });

  const handleResourceClick = (item: CreateResourceButtonItemType) => {
    if (item.route) {
      const to = `${baseUrl}/${item.route}`;
      history.push(to);
    }
  };

  return (
    <div className={CLASS_NAME}>
      <FeatureIndicatorContainer
        featureId={BillingFeature.Services}
        entitlementType={EntitlementType.Metered}
        limitationText="You have reached the maximum number of services allowed. "
        paidPlansExclusive={false}
      >
        <SelectMenu
          title={"Add Resource"}
          buttonStyle={EnumButtonStyle.Primary}
        >
          <SelectMenuModal align="right" withCaret>
            <SelectMenuList>
              {ITEMS.map((item) => (
                <div key={item.type}>
                  <SelectMenuItem
                    closeAfterSelectionChange
                    itemData={item}
                    onSelectionChange={handleResourceClick}
                  >
                    <FlexItem
                      itemsAlign={EnumItemsAlign.Center}
                      start={
                        <ResourceCircleBadge type={item.type} size="small" />
                      }
                    >
                      <span>{item.label}</span>
                    </FlexItem>
                  </SelectMenuItem>
                  {item.showDivider && <HorizontalRule smallSpacing />}
                </div>
              ))}
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      </FeatureIndicatorContainer>
    </div>
  );
};

export default CreateResourceButton;
