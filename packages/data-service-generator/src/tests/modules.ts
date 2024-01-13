import { ModuleAction, ModuleContainer } from "@amplication/code-gen-types";

const USER_MODULE_ID = "clraten4g000fc9yhr62nxheo";
import { USER_ENTITY_ID } from "./entities";

const userModuleContainer: ModuleContainer = {
  id: USER_MODULE_ID,
  resourceId: "clraten1t0004c9yhz1t3o8bp",
  parentBlockId: null,
  name: "User",
  enabled: true,
  entityId: USER_ENTITY_ID,
};
const userModuleDefaultActions: ModuleAction[] = [
  {
    id: "clraten5x000rc9yh29927zwf",
    displayName: "Find Users",
    description: "Find many Users",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: USER_MODULE_ID,
    name: "users",
    path: "",
    enabled: false, //disable the default action
    restVerb: "Get",
    actionType: "Find",
    gqlOperation: "Query",
  },
  {
    id: "clraten5o000hc9yh0fxyrgde",
    displayName: "Users Meta",
    description: "Meta data about User records",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: USER_MODULE_ID,
    name: "_usersMeta",
    path: "/:id/meta",
    enabled: true,
    restVerb: "Get",
    actionType: "Meta",
    gqlOperation: "Query",
  },
  {
    id: "clraten5q000nc9yhhyfin9wn",
    displayName: "Update User",
    description: "Update one User",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: USER_MODULE_ID,
    name: "updateUser",
    path: "/:id",
    enabled: true,
    restVerb: "Patch",
    actionType: "Update",
    gqlOperation: "Mutation",
  },
  {
    id: "clraten5p000kc9yhxeq2tiz0",
    displayName: "Get User",
    description: "Get one User",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: USER_MODULE_ID,
    name: "user",
    path: "/:id",
    enabled: true,
    restVerb: "Get",
    actionType: "Read",
    gqlOperation: "Query",
  },
  {
    id: "clraten5r000pc9yh9sxgjl3e",
    displayName: "Delete User",
    description: "Delete one User",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: USER_MODULE_ID,
    name: "deleteUser",
    path: "/:id",
    enabled: false, //disable the default action,
    restVerb: "Delete",
    actionType: "Delete",
    gqlOperation: "Mutation",
  },
  {
    id: "clraten5p000lc9yh1fn940ra",
    displayName: "Create User",
    description: "Create one User",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: USER_MODULE_ID,
    name: "createUser",
    path: "",
    enabled: true,
    restVerb: "Post",
    actionType: "Create",
    gqlOperation: "Mutation",
  },
];

export const moduleContainers = [userModuleContainer];
export const defaultActions = [...userModuleDefaultActions];
export const customActions = [];

export const moduleActions = [...defaultActions, ...customActions];
