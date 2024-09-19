import { WizardStep } from "../types";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";

export const CREATE_SERVICE_STEPS: WizardStep[] = [
  {
    index: 1,
    hideBackButton: true,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_Name,
    stepName: "CreateServiceName",
  },
  {
    index: 2,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_Git,
    stepName: "CreateGithubSync",
  },
  {
    index: 3,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_APISettings,
    stepName: "CreateGenerationSettings",
  },
  {
    index: 4,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_RepoSettings,
    stepName: "CreateServiceRepository",
  },
  {
    index: 5,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_DBSettings,
    stepName: "CreateServiceDatabase",
  },
  {
    index: 7,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_AuthSettings,
    stepName: "CreateServiceAuth",
  },
  {
    index: 9,
    hideBackButton: true,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_Finish,
    stepName: "CreateServiceNextSteps",
  },
];

export const CREATE_SERVICE_PATTERN = CREATE_SERVICE_STEPS.map(
  (step) => step.index
);
