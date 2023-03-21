import { FormikProps } from "formik";

export interface ResourceSettings {
  serviceName: string;
  gitOrganizationId: string;
  gitRepositoryName: string;
  generateAdminUI: boolean;
  generateGraphQL: boolean;
  generateRestApi: boolean;
  baseDir: string;
  databaseType: "postgres" | "mysql" | "mongo";
  templateType: "empty" | "orderManagement";
  authType: string;
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
  formik?: FormikProps<{ [key: string]: any }>;
}
