import { WizardStep } from "../types";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";

export const ONBOARDING_STEPS: WizardStep[] = [
  {
    index: 0,
    hideFooter: true,
    hideBackButton: true,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_Welcome,
    stepName: "CreateServiceWelcome",
  },
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
    index: 6,
    analyticsEventName:
      AnalyticsEventNames.ViewServiceWizardStep_EntitiesSettings,
    stepName: "CreateServiceTemplate",
  },
  {
    index: 7,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_AuthSettings,
    stepName: "CreateServiceAuth",
  },
  {
    index: 8,
    hideBackButton: true,
    analyticsEventName:
      AnalyticsEventNames.ViewServiceWizardStep_CodeGeneration,
    stepName: "CreateServiceCodeGeneration",
  },
  {
    index: 9,
    hideBackButton: true,
    analyticsEventName: AnalyticsEventNames.ViewServiceWizardStep_Finish,
    stepName: "CreateServiceNextSteps",
  },
];

export const ONBOARDING_PATTERN = ONBOARDING_STEPS.map((step) => step.index);
