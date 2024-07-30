import {
  ModuleAction,
  ModuleContainer,
  ModuleDto,
} from "@amplication/code-gen-types";
import { USER_ID as USER_ENTITY_ID } from "./entities";
const USER_MODULE_ID = "clraten4g000fc9yhr62nxheo";
const PROMOTE_USER_INPUT_DTO_ID = "promoteUserInputDtoId";
const PROMOTE_USER_ARGS_DTO_ID = "promoteUserArgsDtoId";

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
    path: "/meta",
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

const userModuleCustomActions: ModuleAction[] = [
  {
    id: "clraten5x000rc9yh29927zwf",
    displayName: "Promote User",
    description: "Promote one User to admin",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: USER_MODULE_ID,
    name: "promoteUser",
    path: "/:id/promote",
    enabled: true,
    restVerb: "Post",
    actionType: "Custom",
    gqlOperation: "Mutation",
    outputType: {
      isArray: true,
      type: "Dto",
      dtoId: PROMOTE_USER_INPUT_DTO_ID, //replace with reference to dto by its id
    },
    inputType: {
      isArray: false,
      type: "Dto",
      dtoId: PROMOTE_USER_ARGS_DTO_ID,
    },
    restInputSource: "Split",
    restInputParamsPropertyName: "where",
    restInputBodyPropertyName: "data",
    restInputQueryPropertyName: "query",
  },
  {
    id: "clraten5x000rc9yh29927zwf",
    displayName: "Send Password Reset Email",
    description: "Send password reset email to one User",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: USER_MODULE_ID,
    name: "sendPasswordResetEmail",
    path: "/:id/sendPasswordResetEmail",
    enabled: true,
    restVerb: "Patch",
    actionType: "Custom",
    gqlOperation: "Mutation",
    outputType: {
      isArray: false,
      type: "Boolean",
      dtoId: "",
    },
    inputType: {
      isArray: false,
      type: "Dto",
      dtoId: PROMOTE_USER_INPUT_DTO_ID, //replace with reference to dto by its id
    },
  },
  {
    id: "clraten5x000rc9yh29927zwf",
    displayName: "Resend Invite Email",
    description: "Resend invite email to one User",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: USER_MODULE_ID,
    name: "resendInviteEmail",
    path: "/:id/resendInviteEmail",
    enabled: true,
    restVerb: "Get",
    actionType: "Custom",
    gqlOperation: "Query",
    outputType: {
      isArray: false,
      type: "Dto",
      dtoId: PROMOTE_USER_INPUT_DTO_ID, //replace with reference to dto by its id
    },
    inputType: {
      isArray: false,
      type: "Dto",
      dtoId: PROMOTE_USER_INPUT_DTO_ID, //replace with reference to dto by its id
    },
  },
  {
    id: "clraten5x000rc9yh29927zwf",
    displayName: "Soft Delete User",
    description: "Soft delete one User",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: USER_MODULE_ID,
    name: "softDeleteUser",
    path: "/:id/softDeleteUser",
    enabled: true,
    restVerb: "Delete",
    actionType: "Custom",
    gqlOperation: "Mutation",
    outputType: {
      isArray: false,
      type: "Dto",
      dtoId: PROMOTE_USER_INPUT_DTO_ID, //replace with reference to dto by its id
    },
    inputType: {
      isArray: false,
      type: "Dto",
      dtoId: PROMOTE_USER_INPUT_DTO_ID, //replace with reference to dto by its id
    },
  },
];

const userModuleDefaultDtos: ModuleDto[] = [
  {
    id: "clraten970011c9yhe7fmtc2p",
    description: "Args type for User deletion",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: "clraten4g000fc9yhr62nxheo",
    name: "DeleteUserArgs",
    dtoType: "DeleteArgs",
    enabled: true,
    properties: [],
  },
  {
    id: "clraten980019c9yhv4pjmzqp",
    description: "Args type for User creation",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: "clraten4g000fc9yhr62nxheo",
    name: "CreateUserArgs",
    dtoType: "CreateArgs",
    enabled: true,
    properties: [],
  },
  {
    id: "UserWhereUniqueInput_ID",
    description: "",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: "clraten4g000fc9yhr62nxheo",
    name: "UserWhereUniqueInput",
    dtoType: "WhereUniqueInput",
    enabled: true,
    properties: [],
  },
];

const userModuleCustomDtos: ModuleDto[] = [
  {
    id: PROMOTE_USER_ARGS_DTO_ID,
    description: "",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: "clraten4g000fc9yhr62nxheo",
    name: "PromoteUserArgs",
    dtoType: "Custom",
    enabled: true,
    properties: [
      {
        name: "data",
        isArray: false,
        isOptional: true,
        propertyTypes: [
          {
            type: "Dto",
            dtoId: PROMOTE_USER_INPUT_DTO_ID,
            isArray: false,
          },
        ],
      },
      {
        name: "where",
        isArray: false,
        isOptional: false,
        propertyTypes: [
          {
            type: "Dto",
            dtoId: "UserWhereUniqueInput_ID",
            isArray: false,
          },
        ],
      },
      {
        name: "query",
        isArray: false,
        isOptional: false,
        propertyTypes: [
          {
            type: "Dto",
            dtoId: "UserWhereUniqueInput_ID",
            isArray: false,
          },
        ],
      },
    ],
  },
  {
    id: PROMOTE_USER_INPUT_DTO_ID,
    description: "",
    resourceId: "clraten1t0004c9yhz1t3o8bp",
    parentBlockId: "clraten4g000fc9yhr62nxheo",
    name: "PromoteUserInput",
    dtoType: "Custom",
    enabled: true,
    properties: [
      {
        name: "userId",
        isArray: false,
        isOptional: false,
        propertyTypes: [{ type: "String", dtoId: null, isArray: true }],
      },
      {
        name: "score",
        isArray: false,
        isOptional: false,
        propertyTypes: [{ type: "Integer", isArray: false }],
      },
      {
        name: "isAdmin",
        isArray: false,
        isOptional: false,
        propertyTypes: [{ type: "Boolean", isArray: false }],
      },
      {
        name: "lastLogin",
        isArray: false,
        isOptional: false,
        propertyTypes: [{ type: "DateTime", isArray: false }],
      },
      {
        name: "weightedScore",
        isArray: false,
        isOptional: true,
        propertyTypes: [{ type: "Float", isArray: false }],
      },
      {
        name: "extendedProfile",
        isArray: false,
        isOptional: true,
        propertyTypes: [{ type: "Json", isArray: false }],
      },
      {
        name: "selfReference",
        isArray: false,
        isOptional: true,
        propertyTypes: [
          { type: "Dto", isArray: false, dtoId: PROMOTE_USER_INPUT_DTO_ID },
        ],
      },
      {
        name: "selfReferenceArray",
        isArray: false,
        isOptional: true,
        propertyTypes: [
          { type: "Dto", isArray: true, dtoId: PROMOTE_USER_INPUT_DTO_ID },
        ],
      },
    ],
  },
];

export const moduleContainers = [userModuleContainer];

export const defaultActions = [...userModuleDefaultActions];
export const customActions = [...userModuleCustomActions];

export const defaultDtos = [...userModuleDefaultDtos];
export const customDtos = [...userModuleCustomDtos];

export const moduleActions = [...defaultActions, ...customActions];
export const moduleDtos = [...defaultDtos, ...customDtos];
