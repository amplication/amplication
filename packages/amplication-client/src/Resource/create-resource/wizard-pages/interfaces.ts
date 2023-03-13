import { FormikProps } from "formik";

export interface ResourceSettings {
  serviceName: string;
  gitRepositoryId: string;
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
  moduleCss: string;
  path: string;
  formik?: FormikProps<{ [key: string]: any }>;
}
