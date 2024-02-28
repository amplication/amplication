import ModelOrganizer from "./ModelOrganizer";
import * as models from "../../models";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "../../Components/FeatureIndicatorContainer";
import { BillingFeature } from "@amplication/util-billing-types";
import { ModuleOrganizerDisabled } from "./ModuleOrganizerDisabled";
import PageContent, { EnumPageWidth } from "../../Layout/PageContent";
import { useEffect, useMemo } from "react";
import { getCookie, setCookie } from "../../util/cookie";
import { useAppContext } from "../../context/appContext";
import { ModelOrganizerPersistentData } from "./types";

export type ResourceFilter = models.Resource & {
  isFilter: boolean;
};

export default function ArchitectureConsole() {
  const { currentProject } = useAppContext();

  const currentProjectSavedDataHasChanges = useMemo(() => {
    const currentProjectSavedDataString = localStorage.getItem(
      `modelOrganization_savedState__${currentProject?.id}`
    );
    const currentProjectSavedDataObject: ModelOrganizerPersistentData =
      JSON.parse(currentProjectSavedDataString);

    const hasChanges =
      currentProjectSavedDataObject?.changes?.movedEntities?.length > 0 ||
      currentProjectSavedDataObject?.changes?.newServices?.length > 0;

    return hasChanges;
  }, [currentProject]);

  useEffect(() => {
    const currentChangesConfirmationMessageTypeCookie = getCookie(
      "changesConfirmationMessageType"
    );

    currentProjectSavedDataHasChanges &&
      !currentChangesConfirmationMessageTypeCookie &&
      setCookie("changesConfirmationMessageType", "manual");
  }, [currentProjectSavedDataHasChanges]);

  return (
    <PageContent
      pageTitle={"Architecture Console"}
      pageWidth={EnumPageWidth.Full}
    >
      <FeatureIndicatorContainer
        featureId={BillingFeature.RedesignArchitecture}
        entitlementType={EntitlementType.Boolean}
        showTooltip={false}
        render={({ disabled, icon }) => (
          <>{disabled && <ModuleOrganizerDisabled icon={icon} />}</>
        )}
      />
      <ModelOrganizer />
    </PageContent>
  );
}
