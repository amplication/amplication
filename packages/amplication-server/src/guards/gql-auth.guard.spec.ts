import { Test, TestingModule } from "@nestjs/testing";
import { Reflector } from "@nestjs/core";
import { PermissionsService } from "../core/permissions/permissions.service";
import {
  GqlAuthGuard,
  AUTHORIZE_CONTEXT,
  AuthorizeContextParameters,
} from "./gql-auth.guard";
import { AuthorizableOriginParameter } from "../enums/AuthorizableOriginParameter";
import { Workspace } from "../models/Workspace";
import { AuthUser } from "../core/auth/types";
import { Account } from "../models";
import { RolesPermissions } from "@amplication/util-roles-types";

const EXAMPLE_WORKSPACE_ID = "Example Workspace Id";
const EXAMPLE_PERMISSION: RolesPermissions = "git.org.create";

const EXAMPLE_PERMISSIONS: RolesPermissions[] = [EXAMPLE_PERMISSION];

const EXAMPLE_AUTHORIZE_CONTEXT_PARAMETERS: AuthorizeContextParameters = {
  parameterPath: "where.workspace.id",
  parameterType: AuthorizableOriginParameter.WorkspaceId,
};
const EXAMPLE_HANDLER = () => null;

const EXAMPLE_WORKSPACE = new Workspace();
EXAMPLE_WORKSPACE.id = EXAMPLE_WORKSPACE_ID;

const EXAMPLE_ACCOUNT_ID = "exampleAccountId";
const EXAMPLE_EMAIL = "exampleEmail";
const EXAMPLE_FIRST_NAME = "exampleFirstName";
const EXAMPLE_LAST_NAME = "exampleLastName";
const EXAMPLE_PASSWORD = "examplePassword";

const EXAMPLE_ACCOUNT: Account = {
  id: EXAMPLE_ACCOUNT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: EXAMPLE_EMAIL,
  firstName: EXAMPLE_FIRST_NAME,
  lastName: EXAMPLE_LAST_NAME,
  password: EXAMPLE_PASSWORD,
};

const EXAMPLE_USER: AuthUser = {
  id: "Example User Id",
  createdAt: new Date(),
  updatedAt: new Date(),
  isOwner: false,
  permissions: ["git.org.create", "git.org.delete", "privatePlugin.delete"],
  workspace: EXAMPLE_WORKSPACE,
  account: EXAMPLE_ACCOUNT,
};

const EXAMPLE_FIND_REQUEST_ARGS = {
  where: {
    workspace: { id: EXAMPLE_WORKSPACE_ID },
  },
};

const validateAccessMock = jest.fn((user, originType, originId) => {
  return (
    originType === AuthorizableOriginParameter.WorkspaceId &&
    originId === EXAMPLE_WORKSPACE_ID
  );
});

const reflectorGetMock = jest.fn((metadataKey) => {
  switch (metadataKey) {
    case "permissions":
      return EXAMPLE_PERMISSIONS;
    case AUTHORIZE_CONTEXT:
      return EXAMPLE_AUTHORIZE_CONTEXT_PARAMETERS;
    default: {
      throw new Error("Unexpected metadataKey");
    }
  }
});

describe("GqlAuthGuard", () => {
  let guard: GqlAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Reflector,
          useClass: jest.fn(() => ({
            get: reflectorGetMock,
          })),
        },
        {
          provide: PermissionsService,
          useClass: jest.fn(() => ({
            validateAccess: validateAccessMock,
          })),
        },
        GqlAuthGuard,
      ],
    }).compile();

    guard = module.get<GqlAuthGuard>(GqlAuthGuard);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("should authorize context", async () => {
    expect(
      await guard.authorizeContext(
        EXAMPLE_HANDLER,
        EXAMPLE_FIND_REQUEST_ARGS,
        EXAMPLE_USER
      )
    ).toBe(true);
    expect(reflectorGetMock).toBeCalledWith(AUTHORIZE_CONTEXT, EXAMPLE_HANDLER);
  });
});
