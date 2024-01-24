import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";
import ModelOrganizer from "./ModelOrganizer";
import * as models from "../../models";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "../../Components/FeatureIndicatorContainer";
import { BillingFeature } from "@amplication/util-billing-types";
import { ModuleOrganizerDisabled } from "./ModuleOrganizerDisabled";

export const CLASS_NAME = "architecture-console";

export type ResourceFilter = models.Resource & {
  isFilter: boolean;
};

export default function ArchitectureConsole() {
  return (
    <div className={CLASS_NAME}>
      <FeatureIndicatorContainer
        featureId={BillingFeature.RedesignArchitecture}
        entitlementType={EntitlementType.Boolean}
        render={({ disabled, icon }) => (
          <>{disabled && <ModuleOrganizerDisabled icon={icon} />}</>
        )}
      />
      <ModelOrganizer />
    </div>
  );
}
