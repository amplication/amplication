import {
  EnumButtonStyle,
  EnumItemsAlign,
  FlexItem,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import { BillingFeature } from "@amplication/util-billing-types";
import { useStiggContext } from "@stigg/react-sdk";
import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { CREATE_SERVICE_FROM_TEMPLATE_TRIGGER_URL } from "../ServiceTemplate/NewServiceFromTemplateDialogWithUrlTrigger";
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
    type: models.EnumResourceType.ServiceTemplate,
    label: "Service From Template",
    route: `?${CREATE_SERVICE_FROM_TEMPLATE_TRIGGER_URL}`,
    info: "Create a service from a pre-configured template",
  },
  {
    type: models.EnumResourceType.MessageBroker,
    label: "Message Broker",
    route: "create-broker",
    info: "Create a message broker to facilitate communication between services",
  },
  {
    type: models.EnumResourceType.Component,
    label: "Resource from Blueprint",
    route: "new-resource",
    info: "Create a resource from a blueprint",
  },
];

const CreateResourceButton: React.FC = () => {
  const { stigg } = useStiggContext();
  const history = useHistory();

  const { hasAccess: canUsePrivatePlugins } = stigg.getBooleanEntitlement({
    featureId: BillingFeature.PrivatePlugins,
  });

  const { baseUrl } = useProjectBaseUrl({ overrideIsPlatformConsole: false });

  const handleResourceClick = (item: CreateResourceButtonItemType) => {
    if (item.route) {
      const to = `${baseUrl}/${item.route}`;
      history.push(to);
    }
  };

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
        paidPlansExclusive={false}
      >
        <SelectMenu
          title={"Add Resource"}
          buttonStyle={EnumButtonStyle.Primary}
        >
          <SelectMenuModal align="right" withCaret>
            <SelectMenuList>
              {licensedItems.map((item) => (
                <SelectMenuItem
                  closeAfterSelectionChange
                  itemData={item}
                  onSelectionChange={handleResourceClick}
                  key={item.type}
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
              ))}
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      </FeatureIndicatorContainer>
    </div>
  );
};

export default CreateResourceButton;
