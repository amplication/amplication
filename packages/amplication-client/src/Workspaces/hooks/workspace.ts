import * as models from "../../models";

export type TData = {
  currentWorkspace: models.Workspace;
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

export const WORKSPACE_FORM_SCHEMA = {
  required: ["name"],
  properties: {
    name: {
      type: "string",
      minLength: 2,
    },
  },
};
