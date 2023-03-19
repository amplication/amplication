import { FormikProps } from "formik";
import * as models from "../../../models";

export interface ResourceSettings {
  serviceName: string;
  gitOrganizationId: string;
  gitRepositoryName: string;
  generateAdminUI: boolean;
  generateGraphQL: boolean;
  generateRestApi: boolean;
  structureType: models.EnumResourceStructureType;
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
