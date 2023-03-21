import { FormikProps } from "formik";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";

export interface ResourceSettings {
  serviceName: string;
  gitOrganizationId: string;
  gitRepositoryName: string;
  generateAdminUI: boolean;
  generateGraphQL: boolean;
  generateRestApi: boolean;
  baseDir: string;
  databaseType: "postgres" | "mysql" | "mongo";
  authType: string;
  resourceType: "sample" | "scratch";
}
export interface NextPage {
  nextTitle: string;
  isValid: boolean;
}

export interface WizardStepProps {
  moduleClass: string;
  trackWizardPageEvent: (
    eventName: AnalyticsEventNames,
    additionalData?: { [key: string]: string }
  ) => void;
  formik?: FormikProps<{ [key: string]: any }>;
}
