import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from 'src/core/permissions/permissions.service';
import {
  GqlAuthGuard,
  AUTHORIZE_CONTEXT,
  INJECT_CONTEXT_VALUE,
  AuthorizeContextParameters,
  InjectContextValueParameters
} from './gql-auth.guard';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';
import { User } from 'src/models/User';
import { UserRole } from 'src/models/UserRole';
import { Organization } from 'src/models/Organization';

const EXAMPLE_ORGANIZATION_ID = 'Example Organization Id';
const EXAMPLE_ROLE = 'Example Role';
const EXAMPLE_ROLES: string[] = [EXAMPLE_ROLE];
const EXAMPLE_AUTHORIZE_CONTEXT_PARAMETERS: AuthorizeContextParameters = {
  parameterPath: 'where.organization.id',
  parameterType: AuthorizableResourceParameter.OrganizationId
};
const EXAMPLE_INJECT_CONTEXT_VALUE_PARAMETERS: InjectContextValueParameters = {
  parameterPath: 'data.organization.connect.id',
  parameterType: InjectableResourceParameter.OrganizationId
};
const EXAMPLE_HANDLER = () => null;

const EXAMPLE_USER_ROLE = new UserRole();
EXAMPLE_USER_ROLE.role = EXAMPLE_ROLE;

const EXAMPLE_ORGANIZATION = new Organization();
EXAMPLE_ORGANIZATION.id = EXAMPLE_ORGANIZATION_ID;

const EXAMPLE_USER = new User();
EXAMPLE_USER.userRoles = [EXAMPLE_USER_ROLE];
EXAMPLE_USER.organization = EXAMPLE_ORGANIZATION;

const EXAMPLE_FIND_REQUEST_ARGS = {
  where: {
    organization: { id: EXAMPLE_ORGANIZATION_ID }
  }
};

const validateAccessMock = jest
  .fn()
  .mockImplementation((user, resourceType, resourceId) => {
    return (
      resourceType === AuthorizableResourceParameter.OrganizationId &&
      resourceId === EXAMPLE_ORGANIZATION_ID
    );
  });

const reflectorGetMock = jest.fn().mockImplementation((metadataKey, target) => {
  switch (metadataKey) {
    case 'roles':
      return EXAMPLE_ROLES;
    case AUTHORIZE_CONTEXT:
      return EXAMPLE_AUTHORIZE_CONTEXT_PARAMETERS;
    case INJECT_CONTEXT_VALUE:
      return EXAMPLE_INJECT_CONTEXT_VALUE_PARAMETERS;
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
          useClass: jest.fn().mockImplementation(() => ({
            get: reflectorGetMock
          }))
        },
        {
          provide: PermissionsService,
          useClass: jest.fn().mockImplementation(() => ({
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

  it('should inject context value', () => {
    const requestArgs: {
      data: { name: string; organization?: { connect: { id: string } } };
    } = {
      data: { name: 'Foo' }
    };
    guard.injectContextValue(EXAMPLE_HANDLER, requestArgs, EXAMPLE_USER);
    expect(reflectorGetMock).toBeCalledWith(
      INJECT_CONTEXT_VALUE,
      EXAMPLE_HANDLER
    );
    expect(requestArgs.data.organization.connect.id).toBe(
      EXAMPLE_ORGANIZATION_ID
    );
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
