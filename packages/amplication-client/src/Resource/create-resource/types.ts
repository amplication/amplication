import { AnalyticsEventNames } from "../../util/analytics-events.types";

export type WizardStep = {
  index: number;
  hideFooter?: boolean;
  hideBackButton?: boolean;
  analyticsEventName: AnalyticsEventNames;
  stepName: string;
};

export type WizardFlowType =
  | "Onboarding"
  | "Create Service"
  | "Create Service Template";

export type WizardFlowSettings = {
  steps: WizardStep[];
  pattern: number[];
  texts: { [key: string]: string };
  submitFormIndex: number;
};
