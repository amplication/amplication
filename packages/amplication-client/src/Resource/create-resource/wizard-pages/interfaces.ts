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
  authType: string;
  resourceType: "sample" | "scratch";
}
export interface NextPage {
  nextTitle: string;
  isValid: boolean;
}

export interface WizardStepProps {
  moduleClass: string;
  formik?: FormikProps<{ [key: string]: any }>;
}
