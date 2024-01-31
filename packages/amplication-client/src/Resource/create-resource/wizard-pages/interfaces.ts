import { FormikProps } from "formik";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";
import { EnumGitProvider } from "../../../models";

export interface ResourceSettings {
  serviceName: string;
  gitOrganizationId: string;
  gitRepositoryName: string;
  groupName: string;
  gitProvider: EnumGitProvider;
  isOverrideGitRepository: boolean;
  generateAdminUI: boolean;
  generateGraphQL: boolean;
  generateRestApi: boolean;
  baseDir: string;
  structureType: "Mono" | " Poly";
  databaseType: "postgres" | "mysql" | "mongo" | "sqlserver";
  templateType: "empty" | "orderManagement";
  authType: "no" | "core";
  isGenerateCompleted: string;
  connectToDemoRepo: boolean;
}
export interface NextPage {
  nextTitle: string;
  isValid: boolean;
}

export enum EnumTemplateType {
  empty = "empty",
  orderManagement = "orderManagement",
}

export interface WizardStepProps {
  moduleClass: string;
  trackWizardPageEvent: (
    eventName: AnalyticsEventNames,
    additionalData?: { [key: string]: string }
  ) => void;
  formik?: FormikProps<{ [key: string]: any }>;
  goNextPage?: () => void;
}
