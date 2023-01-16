import * as models from "../../models";
import { validationErrorMessages } from "../../util/formikValidateJsonSchema";

export type TData = {
  currentWorkspace: models.Workspace;
};

export type workspacesListTData = {
  workspaces: models.Workspace[];
};

export type TSetData = {
  setCurrentWorkspace: {
    token: string;
  };
};

export type DType = {
  createWorkspace: models.Workspace;
};

export type CreateWorkspaceType = models.WorkspaceCreateInput;

export const WORKSPACE_INITIAL_VALUES: CreateWorkspaceType = {
  name: "",
};

const { AT_LEAST_TWO_CHARARCTERS } = validationErrorMessages;

export const WORKSPACE_FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 2,
    },
  },
  errorMessage: {
    properties: {
      name: AT_LEAST_TWO_CHARARCTERS,
    },
  },
};
