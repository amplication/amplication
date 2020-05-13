import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '../account/account.service';
import { PasswordService } from '../account/password.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { OrganizationService } from '../organization/organization.service';
import { Account, Organization, User, UserRole } from '@prisma/client';
import { Role } from '../../enums/Role';
import { JwtService } from '@nestjs/jwt';

type UserWithRoles = User & { userRoles: UserRole[] };

const EXAMPLE_TOKEN = 'EXAMPLE TOKEN';

const EXAMPLE_ACCOUNT: Account = {
  id: 'alice',
  email: 'alice@example.com',
  password: 'PASSWORD',
  firstName: 'Alice',
  lastName: 'Appleseed',
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_HASHED_PASSWORD = 'HASHED PASSWORD';
const EXAMPLE_NEW_PASSWORD = 'NEW PASSWORD';
const EXAMPLE_NEW_HASHED_PASSWORD = 'NEW HASHED PASSWORD';

const EXAMPLE_ORGANIZATION: Organization = {
  id: 'exampleOrganization',
  name: 'Example Organization',
  defaultTimeZone: 'GMT-4',
  address: 'Example Organization Address',
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_OTHER_ORGANIZATION: Organization = {
  id: 'exampleOtherOrganization',
  name: 'Example Other Organization',
  defaultTimeZone: 'GMT-4',
  address: 'Example Other Organization Address',
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_USER: User = {
  id: 'exampleUser',
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_USER_ROLE: UserRole = {
  id: 'admin',
  role: Role.ADMIN,
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_USER_WITH_ROLES: UserWithRoles = {
  ...EXAMPLE_USER,
  userRoles: [EXAMPLE_USER_ROLE]
};

const EXAMPLE_OTHER_USER_WITH_ROLES: UserWithRoles = {
  id: 'exampleOtherUser',
  createdAt: new Date(),
  updatedAt: new Date(),
  userRoles: [EXAMPLE_USER_ROLE]
};

const EXAMPLE_ACCOUNT_WITH_CURRENT_USER: Account & { currentUser: User } = {
  ...EXAMPLE_ACCOUNT,
  currentUser: EXAMPLE_USER
};

const signMock = jest.fn().mockImplementation(() => EXAMPLE_TOKEN);

const createAccountMock = jest.fn().mockImplementation(() => EXAMPLE_ACCOUNT);
const setCurrentUserMock = jest
  .fn()
  .mockImplementation(() => EXAMPLE_ACCOUNT_WITH_CURRENT_USER);
const findAccountMock = jest.fn().mockImplementation(() => ({
  ...EXAMPLE_ACCOUNT,
  currentUser: {
    ...EXAMPLE_USER_WITH_ROLES,
    organization: EXAMPLE_ORGANIZATION
  }
}));
const setPasswordMock = jest.fn();

const hashPasswordMock = jest.fn().mockImplementation(password => {
  switch (password) {
    case EXAMPLE_ACCOUNT.password:
      return EXAMPLE_HASHED_PASSWORD;
    case EXAMPLE_NEW_PASSWORD:
      return EXAMPLE_NEW_HASHED_PASSWORD;
  }
  throw new Error(`Unexpected password: "${password}"`);
});
const validatePasswordMock = jest.fn().mockImplementation(() => true);

const findUsersMock = jest
  .fn()
  .mockImplementation(() => [EXAMPLE_OTHER_USER_WITH_ROLES]);

const createOrganizationMock = jest.fn().mockImplementation(() => ({
  ...EXAMPLE_ORGANIZATION,
  users: [EXAMPLE_USER_WITH_ROLES]
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    signMock.mockClear();
    createAccountMock.mockClear();
    setCurrentUserMock.mockClear();
    findAccountMock.mockClear();
    setPasswordMock.mockClear();
    hashPasswordMock.mockClear();
    validatePasswordMock.mockClear();
    findUsersMock.mockClear();
    createOrganizationMock.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AccountService,
          useClass: jest.fn().mockImplementation(() => ({
            createAccount: createAccountMock,
            setCurrentUser: setCurrentUserMock,
            findAccount: findAccountMock,
            setPassword: setPasswordMock
          }))
        },
        {
          provide: PasswordService,
          useClass: jest.fn().mockImplementation(() => ({
            hashPassword: hashPasswordMock,
            validatePassword: validatePasswordMock
          }))
        },
        {
          provide: UserService,
          useClass: jest.fn().mockImplementation(() => ({
            findUsers: findUsersMock
          }))
        },
        {
          provide: OrganizationService,
          useClass: jest.fn().mockImplementation(() => ({
            createOrganization: createOrganizationMock
          }))
        },
        {
          provide: JwtService,
          useClass: jest.fn().mockImplementation(() => ({
            sign: signMock
          }))
        },
        AuthService
      ],
      imports: []
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sign ups for correct data', async () => {
    const result = await service.signup({
      email: EXAMPLE_ACCOUNT.email,
      password: EXAMPLE_ACCOUNT.password,
      firstName: EXAMPLE_ACCOUNT.firstName,
      lastName: EXAMPLE_ACCOUNT.lastName,
      organizationName: EXAMPLE_ORGANIZATION.name,
      defaultTimeZone: EXAMPLE_ORGANIZATION.defaultTimeZone,
      address: EXAMPLE_ORGANIZATION.address
    });
    expect(result).toBe(EXAMPLE_TOKEN);
    expect(createAccountMock).toHaveBeenCalledTimes(1);
    expect(createAccountMock).toHaveBeenCalledWith({
      data: {
        email: EXAMPLE_ACCOUNT.email,
        password: EXAMPLE_HASHED_PASSWORD,
        firstName: EXAMPLE_ACCOUNT.firstName,
        lastName: EXAMPLE_ACCOUNT.lastName
      }
    });
    expect(setCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(setCurrentUserMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_USER.id
    );
    expect(hashPasswordMock).toHaveBeenCalledTimes(1);
    expect(hashPasswordMock).toHaveBeenCalledWith(EXAMPLE_ACCOUNT.password);
    expect(createOrganizationMock).toHaveBeenCalledTimes(1);
    expect(createOrganizationMock).toHaveBeenCalledWith(EXAMPLE_ACCOUNT.id, {
      data: {
        name: EXAMPLE_ORGANIZATION.name,
        defaultTimeZone: EXAMPLE_ORGANIZATION.defaultTimeZone,
        address: EXAMPLE_ORGANIZATION.address
      }
    });
    expect(signMock).toHaveBeenCalledTimes(1);
    expect(signMock).toHaveBeenCalledWith({
      accountId: EXAMPLE_ACCOUNT.id,
      organizationId: EXAMPLE_ORGANIZATION.id,
      roles: [EXAMPLE_USER_ROLE.role],
      userId: EXAMPLE_USER.id
    });
  });

  it('login for existing user', async () => {
    const result = await service.login(
      EXAMPLE_ACCOUNT.email,
      EXAMPLE_ACCOUNT.password
    );
    expect(result).toBe(EXAMPLE_TOKEN);
    expect(findAccountMock).toHaveBeenCalledTimes(1);
    expect(findAccountMock).toHaveBeenCalledWith({
      where: {
        email: EXAMPLE_ACCOUNT.email
      },
      include: {
        currentUser: { include: { organization: true, userRoles: true } }
      }
    });
    expect(validatePasswordMock).toHaveBeenCalledTimes(1);
    expect(validatePasswordMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.password,
      EXAMPLE_ACCOUNT.password
    );
    expect(signMock).toHaveBeenCalledTimes(1);
    expect(signMock).toHaveBeenCalledWith({
      accountId: EXAMPLE_ACCOUNT.id,
      organizationId: EXAMPLE_ORGANIZATION.id,
      roles: [EXAMPLE_USER_ROLE.role],
      userId: EXAMPLE_USER.id
    });
  });

  it('sets current organization for existing user and existing organization', async () => {
    const result = await service.setCurrentOrganization(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_OTHER_ORGANIZATION.id
    );
    expect(result).toBe(EXAMPLE_TOKEN);
    expect(findUsersMock).toHaveBeenCalledTimes(1);
    expect(findUsersMock).toHaveBeenCalledWith({
      where: {
        organization: {
          id: EXAMPLE_OTHER_ORGANIZATION.id
        },
        account: {
          id: EXAMPLE_ACCOUNT.id
        }
      },
      include: {
        userRoles: true
      },
      first: 1
    });
    expect(setCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(setCurrentUserMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_OTHER_USER_WITH_ROLES.id
    );
    expect(signMock).toHaveBeenCalledTimes(1);
    expect(signMock).toHaveBeenCalledWith({
      accountId: EXAMPLE_ACCOUNT.id,
      organizationId: EXAMPLE_OTHER_ORGANIZATION.id,
      roles: [EXAMPLE_USER_ROLE.role],
      userId: EXAMPLE_OTHER_USER_WITH_ROLES.id
    });
  });

  it('changes password for existing account', async () => {
    await service.changePassword(EXAMPLE_ACCOUNT.id, EXAMPLE_ACCOUNT.password, {
      oldPassword: EXAMPLE_ACCOUNT.password,
      newPassword: EXAMPLE_NEW_PASSWORD
    });
    expect(validatePasswordMock).toHaveBeenCalledTimes(1);
    expect(validatePasswordMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.password,
      EXAMPLE_ACCOUNT.password
    );
    expect(hashPasswordMock).toHaveBeenCalledTimes(1);
    expect(hashPasswordMock).toHaveBeenCalledWith(EXAMPLE_NEW_PASSWORD);
    expect(setPasswordMock).toHaveBeenCalledTimes(1);
    expect(setPasswordMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_NEW_HASHED_PASSWORD
    );
  });
});
