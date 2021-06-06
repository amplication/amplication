import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from 'src/core/permissions/permissions.service';
import {
  GqlAuthGuard,
  AUTHORIZE_CONTEXT,
  AuthorizeContextParameters
} from './gql-auth.guard';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { User } from 'src/models/User';
import { UserRole } from 'src/models/UserRole';
import { Workspace } from 'src/models/Workspace';

const EXAMPLE_WORKSPACE_ID = 'Example Workspace Id';
const EXAMPLE_ROLE = 'Example Role';
const EXAMPLE_ROLES: string[] = [EXAMPLE_ROLE];
const EXAMPLE_AUTHORIZE_CONTEXT_PARAMETERS: AuthorizeContextParameters = {
  parameterPath: 'where.workspace.id',
  parameterType: AuthorizableResourceParameter.WorkspaceId
};
const EXAMPLE_HANDLER = () => null;

const EXAMPLE_USER_ROLE = new UserRole();
EXAMPLE_USER_ROLE.role = EXAMPLE_ROLE;

const EXAMPLE_WORKSPACE = new Workspace();
EXAMPLE_WORKSPACE.id = EXAMPLE_WORKSPACE_ID;

const EXAMPLE_USER = new User();
EXAMPLE_USER.userRoles = [EXAMPLE_USER_ROLE];
EXAMPLE_USER.workspace = EXAMPLE_WORKSPACE;

const EXAMPLE_FIND_REQUEST_ARGS = {
  where: {
    workspace: { id: EXAMPLE_WORKSPACE_ID }
  }
};

const validateAccessMock = jest.fn((user, resourceType, resourceId) => {
  return (
    resourceType === AuthorizableResourceParameter.WorkspaceId &&
    resourceId === EXAMPLE_WORKSPACE_ID
  );
});

const reflectorGetMock = jest.fn(metadataKey => {
  switch (metadataKey) {
    case 'roles':
      return EXAMPLE_ROLES;
    case AUTHORIZE_CONTEXT:
      return EXAMPLE_AUTHORIZE_CONTEXT_PARAMETERS;
    default: {
      throw new Error('Unexpected metadataKey');
    }
  }
});

describe('GqlAuthGuard', () => {
  let guard: GqlAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: Reflector,
          useClass: jest.fn(() => ({
            get: reflectorGetMock
          }))
        },
        {
          provide: PermissionsService,
          useClass: jest.fn(() => ({
            validateAccess: validateAccessMock
          }))
        },
        GqlAuthGuard
      ]
    }).compile();

    guard = module.get<GqlAuthGuard>(GqlAuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should check if can activate roles', () => {
    expect(guard.canActivateRoles(EXAMPLE_HANDLER, EXAMPLE_USER)).toBe(true);
    expect(reflectorGetMock).toBeCalledWith('roles', EXAMPLE_HANDLER);
  });

  it('should authorize context', async () => {
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
