import { FormikProps } from "formik";

export interface ResourceSettings {
  serviceName: string;
  gitOrganizationId: string;
  gitRepositoryName: string;
  generateAdminUI: boolean;
  generateGraphQL: boolean;
  generateRestApi: boolean;
  structureType: "monorepo" | "polyrepo";
  dataBaseType: "postgres" | "mysql" | "mongo";
  authSwitch: boolean;
}
export interface NextPage {
  nextTitle: string;
  isValid: boolean;
}

export interface WizardStepProps {
  moduleClass: string;
  path: string;
  step: string;
  formik?: FormikProps<{ [key: string]: any }>;
}
