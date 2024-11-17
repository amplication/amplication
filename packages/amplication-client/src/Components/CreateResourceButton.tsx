import {
  CircleBadge,
  CircularProgress,
  EnumButtonStyle,
  EnumItemsAlign,
  FlexItem,
  Icon,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Snackbar,
} from "@amplication/ui/design-system";
import { BillingFeature } from "@amplication/util-billing-types";
import { useStiggContext } from "@stigg/react-sdk";
import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import useBlueprints from "../Blueprints/hooks/useBlueprints";
import {
  prepareComponentObject,
  resourceThemeMap,
} from "../Resource/constants";
import { CREATE_SERVICE_FROM_TEMPLATE_TRIGGER_URL } from "../ServiceTemplate/NewServiceFromTemplateDialogWithUrlTrigger";
import { useAppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
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
];

type Props = {
  servicesLength: number;
};

const CreateResourceButton: React.FC<Props> = ({ servicesLength }) => {
  const { stigg } = useStiggContext();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);

  const { hasAccess: canUsePrivatePlugins } = stigg.getBooleanEntitlement({
    featureId: BillingFeature.PrivatePlugins,
  });

  const { findBlueprintsData } = useBlueprints();

  const availableBluePrints = useMemo(() => {
    return findBlueprintsData?.blueprints.filter((b) => b.enabled) || [];
  }, [findBlueprintsData]);

  const { currentProject, createComponent, errorCreateComponent } =
    useAppContext();

  const { baseUrl } = useProjectBaseUrl({ overrideIsPlatformConsole: false });

  const errorMessage = formatError(errorCreateComponent);

  const handleResourceClick = (item: CreateResourceButtonItemType) => {
    if (item.route) {
      const to = `${baseUrl}/${item.route}`;
      history.push(to);
    }
  };

  const handleComponentClick = (blueprint: models.Blueprint) => {
    const resource = prepareComponentObject(currentProject.id, blueprint);
    setLoading(true);
    createComponent(resource);
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
        actualUsage={servicesLength}
        paidPlansExclusive={false}
      >
        <SelectMenu
          title={!loading ? "Add Component" : <CircularProgress />}
          buttonStyle={EnumButtonStyle.Primary}
          disabled={loading}
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

              {availableBluePrints.map((blueprint, index) => (
                <SelectMenuItem
                  itemData={blueprint}
                  onSelectionChange={handleComponentClick}
                  key={blueprint.id}
                >
                  <FlexItem
                    itemsAlign={EnumItemsAlign.Center}
                    start={
                      <CircleBadge color={blueprint.color} size={"small"}>
                        <Icon
                          icon={
                            resourceThemeMap[models.EnumResourceType.Component]
                              .icon
                          }
                          size={"small"}
                        />
                      </CircleBadge>
                    }
                  >
                    <span>{blueprint.name}</span>
                  </FlexItem>
                </SelectMenuItem>
              ))}
            </SelectMenuList>
          </SelectMenuModal>
        </SelectMenu>
      </FeatureIndicatorContainer>
      <Snackbar open={Boolean(errorCreateComponent)} message={errorMessage} />
    </div>
  );
};

export default CreateResourceButton;
