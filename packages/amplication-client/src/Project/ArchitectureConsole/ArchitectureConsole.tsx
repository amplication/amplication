import ModelOrganizer from "./ModelOrganizer";
import * as models from "../../models";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "../../Components/FeatureIndicatorContainer";
import { BillingFeature } from "@amplication/util-billing-types";
import { ModuleOrganizerDisabled } from "./ModuleOrganizerDisabled";
import PageContent, { EnumPageWidth } from "../../Layout/PageContent";

export type ResourceFilter = models.Resource & {
  isFilter: boolean;
};

export default function ArchitectureConsole() {
  return (
    <PageContent
      pageTitle={"Architecture Console"}
      pageWidth={EnumPageWidth.Full}
    >
      <FeatureIndicatorContainer
        featureId={BillingFeature.RedesignArchitecture}
        entitlementType={EntitlementType.Boolean}
        render={({ disabled, icon }) => (
          <>{disabled && <ModuleOrganizerDisabled icon={icon} />}</>
        )}
      />
      <ModelOrganizer />
    </PageContent>
  );
}
