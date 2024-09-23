import { WizardStep } from "../types";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";

export const CREATE_SERVICE_TEMPLATE_STEPS: WizardStep[] = [
  {
    index: 1,
    hideBackButton: true,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_Name,
    stepName: "CreateServiceName",
  },
  {
    index: 3,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_APISettings,
    stepName: "CreateGenerationSettings",
  },
  {
    index: 5,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_DBSettings,
    stepName: "CreateServiceDatabase",
  },
  {
    index: 9,
    hideBackButton: true,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_Finish,
    stepName: "CreateServiceNextSteps",
  },
];

export const CREATE_SERVICE_TEMPLATE_PATTERN =
  CREATE_SERVICE_TEMPLATE_STEPS.map((step) => step.index);
